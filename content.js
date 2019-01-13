var itad_request_timer = null;
var itad_display_timer = null;
var itad_included = false;
var itad_info_container = null;
var itad_info_status = null;
var itad_info_container_header = null;

function handleLinks()
{
	if (location.href.indexOf("isthereanydeal.com") == -1)
	{
		var external_links = document.querySelectorAll('a[href*="//store.steampowered.com/"]:not(.itadhandled)');
		for (var i = 0; i < external_links.length; i++) 
		{
			let appIDs = external_links[i].href.match(/\/\/store.steampowered.com\/(app|apps|sub|bundle)\/([0-9]+)/);
			let appID = null;
			
			if(appIDs && appIDs.length == 3) appID = appIDs[2];
			
			if (appID)
			{
				const elementToAppend = document.createElement('span');
				elementToAppend.dataset.idforitad = appIDs[1] + '/' + appIDs[2];
				elementToAppend.className += "itad_extra_elem";
				elementToAppend.innerHTML = Icon.main;
				appendAfterFirstText(external_links[i], elementToAppend);
				
				elementToAppend.addEventListener("mouseenter", OnEnterExtraElem, { passive: !0 });
				elementToAppend.addEventListener("mouseleave", OnLeaveExtraElem, { passive: !0 });
				
				external_links[i].classList.add("itadhandled");
			}
		}
	}
	
	if(itad_included && itad_info_container === null)
	{
		itad_info_container = document.createElement('div');
		itad_info_container.id = "itad_info_container";
		itad_info_container_header = document.createElement('div');
		itad_info_container_header.innerHTML = "<a id='itad_info_container_header' target='_blank' rel='noopener' href='https://isthereanydeal.com/'>IsThereAnyDeal</a>";
		itad_info_container.appendChild(itad_info_container_header);
		itad_info_status = document.createElement('div');
		itad_info_status.id = "itad_info_status";
		itad_info_status.innerHTML = "ITAD Ready...<br/>"+Icon.spinner;
		itad_info_container.appendChild(itad_info_status);
		document.body.appendChild(itad_info_container);
		
		itad_info_container.addEventListener("mouseenter", OnEnterContainer, { passive: !0 });
		itad_info_container.addEventListener("mouseleave", OnLeaveContainer, { passive: !0 });
		
		itad_display_timer = setTimeout(function () { itad_info_container.className += "itad_info_container_hidden"; }, 2000);
	}
}

function appendAfterFirstText(parentElement, elementToAppend) 
{
	for (const childElement of parentElement.childNodes) 
	{
		
		if ((childElement.nodeType === Node.TEXT_NODE && childElement.textContent.trim().length > 0) || childElement.nodeName === 'I') 
		{
			parentElement.insertBefore(elementToAppend, childElement.nextSibling);
			itad_included = true;
			return true;
		}
		
		if (appendAfterFirstText(childElement, elementToAppend)) 
		{
			return true;
		}
	}
	return false;
}

function getItemInfo(e, currentInfoElemId)
{
	clearTimeout(itad_request_timer);
	itad_request_timer = setTimeout(function () {
		
		var feedURL = "https://api.isthereanydeal.com/v01/game/overview/?key="+ITAD_API_KEY+"&plains=&shop=steam&ids="+encodeURIComponent(e.target.dataset.idforitad);
		var xhr1 = new XMLHttpRequest();
		xhr1.open("GET", feedURL, true);
		xhr1.onreadystatechange = function () {
			buildItemInfo(e, currentInfoElemId);
		};
		xhr1.send();
		
		function buildItemInfo(a, b)
		{
			if (xhr1.readyState == 4 && xhr1.status == 200)
			{
				var result = xhr1.responseText.replace(/(<([^>]+)>)/ig, "");
				var result = JSON.parse(result);
				
				var itad_info_output = '';
				var keyvalue = Object.keys(result['data'])[0];
				var itad_item = result['data'][keyvalue];
				var itad_plain = '';
				var steamappid = b.match(/app-([0-9]+)/);
				
				if(itad_item && itad_item['urls'] && itad_item['urls']['info'])
				{
					itad_plain = itad_item['urls']['info'].match(/isthereanydeal.com\/game\/(\w+)\/info/);
				}
				
				if(itad_item && itad_item['price'])
				{
					var price_cut_output = '';
					if(itad_item['price']['cut'] != 0) price_cut_output = '<div class="itad_info_elem_cut">' + Icon.price + ' -'+itad_item['price']['cut']+'%</div>';
					
					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['price']['url']+'" class="itadhandled itad_info_elem_price">Best price now:<div class="itad_info_elem_highlighted">'+price_cut_output+itad_item['price']['price_formatted']+'</div>at '+itad_item['price']['store']+'</a>';
				}
				
				if(itad_item && itad_item['urls'] && itad_item['urls']['info'])
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['urls']['info']+'" class="itad_info_elem_btn">'+ Icon.deals +' Show all deals</a>';
				}
				
				if(itad_item && itad_item['lowest'])
				{			
					var price_cut_output = '';
					if(itad_item['lowest']['cut'] != 0) price_cut_output = '<div class="itad_info_elem_cut">-'+itad_item['lowest']['cut']+'%</div>';
					
					var lowest_url = '';
					if(itad_item['lowest']['url']) lowest_url = 'href="'+itad_item['lowest']['url']+'"';
					
					itad_info_output += '<a target="_blank" rel="noopener" '+lowest_url+' class="itadhandled itad_info_elem_price itad_info_elem_price_lowest">History low:<div class="itad_info_elem_highlighted">'+ Icon.historylow + ' '+price_cut_output+itad_item['lowest']['price_formatted']+'</div>at '+itad_item['lowest']['store']+' '+itad_item['lowest']['recorded_formatted']+'</a>';
				}
				
				if(itad_plain && itad_plain.length == 2)
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="https://isthereanydeal.com/#/page:game/wait?plain='+itad_plain[1]+'" class="itad_info_elem_btn">'+ Icon.waitlist +' Add to ITAD Waitlist</a>';
				}
				
				if(itad_item && itad_item['urls'] && itad_item['urls']['history'])
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['urls']['history']+'" class="itad_info_elem_btn">' + Icon.history + ' Price history</a>';
				}
				
				if(steamappid && steamappid.length == 2)
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="http://steampeek.hu?appid='+steamappid[1]+'#itadext" class="itad_info_elem_btn">' + Icon.similar + ' Browse similar games</a>';
				}
				
				var itad_info_elem = document.createElement("div");
				itad_info_elem.id = b;
				itad_info_elem.className += "itad_info_elem";
				
				if(itad_info_output != '')
				{
					itad_info_elem.innerHTML = itad_info_output;
				}
				else
				{
					itad_info_elem.classList.add("noinfo");
					itad_info_elem.innerHTML = '<div class="itad_info_elem_info">Currently there is no information for this game.<br/><br/>You can visit our site and browse all deals:</div><a class="itad_info_elem_btn" target="_blank" rel="noopener" href="https://isthereanydeal.com/">'+Icon.main+' Trending deals</a>';
				}
				
				if(!document.getElementById(b))
				{
					document.getElementById("itad_info_container").appendChild(itad_info_elem);
				}
				keepInViewPort(itad_info_container);
				itad_info_status.innerHTML = "";
			}
		}
	}, 350);
}

function OnEnterExtraElem(e)
{
	var rect = e.target.getBoundingClientRect();
	itad_info_container.style.left = (getCoords(e.target).left + (rect.right - rect.left) - 8) + "px";
	itad_info_container.style.top = (getCoords(e.target).top + (rect.bottom - rect.top) - 8 - 82) + "px";
	
	clearTimeout(itad_display_timer);
	itad_info_container.classList.remove("itad_info_container_hidden");
	
	var currentInfoElemId = "itad_info_elem_" + e.target.dataset.idforitad.replace('/','-');
		
	var divsToHide = document.getElementsByClassName("itad_info_elem");
	for (var i = 0; i < divsToHide.length; i++)
	{
		if (divsToHide.id != currentInfoElemId)
		{
			divsToHide[i].style.display = "none";
		}
	}
	
	var currentInfoElem = document.getElementById(currentInfoElemId);
	
	if(currentInfoElem)
	{
		itad_info_status.innerHTML = "";
		currentInfoElem.style.display = 'block';
	}
	else
	{
		itad_info_status.innerHTML = "ITAD working...<br/>"+Icon.spinner;
		getItemInfo(e, currentInfoElemId);
	}
	
	keepInViewPort(itad_info_container);
}

function OnLeaveExtraElem(e)
{
	if(itad_info_container.classList.contains('itad_info_container_hidden')) clearTimeout(itad_request_timer);
	itad_display_timer = setTimeout(function () { itad_info_container.className += "itad_info_container_hidden"; }, 200);
}

function OnEnterContainer()
{
	clearTimeout(itad_display_timer);
	itad_info_container.classList.remove("itad_info_container_hidden");
}

function OnLeaveContainer()
{
	itad_display_timer = setTimeout(function () { itad_info_container.className += "itad_info_container_hidden"; }, 200);
}

function keepInViewPort(elem)
{
	var rect = elem.getBoundingClientRect();
	
	if(rect.bottom + 20 > window.innerHeight) { elem.style.top = (getCoords(elem).top - (rect.bottom - window.innerHeight) - 20) + "px"; }
	if(rect.right + 20 > window.innerWidth) { elem.style.left = (getCoords(elem).left - (rect.right - window.innerWidth) - 20) + "px"; }
}

function getCoords(elem) 
{
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

var targetNode = document;
var config = { attributes: true, childList: true, subtree: true };

var callback = function(mutationsList) {
    for (var mutation of mutationsList) 
	{
        if (mutation.type == 'childList') 
		{
			handleLinks();
        }
    }
};

var observer = new MutationObserver(callback);

observer.observe(targetNode, config);
handleLinks();
