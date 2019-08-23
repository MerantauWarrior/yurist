 
function t121_setHeight(recid){
    var div=$("#youtubeiframe"+recid);
    var height=div.width() * 0.5625;
    div.height(height);
    div.parent().height(height);         
} 
function t190_scrollToTop(){
    $('html, body').animate({scrollTop: 0}, 700);								
}	  
 
function t199_showMenu(recid){
  var el=$("#rec"+recid);
  el.find('.t199__js__menu').each(function() {
    var $toggler = el.find('.t199__js__menu-toggler'),
    $menu = $(this),
    $body = $('body'),
    CLASS_MENU = 't199__is__menu';
      
  $menu.find('.t199__menu-item').each(function() {
    var curUrl = $(this).attr('href');
    if (typeof curUrl != 'undefined' && curUrl.indexOf('#') > -1 && curUrl.substring(0, 9) != '#submenu:') {
      $(this).on('click', function(e) {
        $body.removeClass(CLASS_MENU);
        });
    }
  });      

    $toggler.on('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      $body.toggleClass(CLASS_MENU);
    });

    $(document).on('click', function() {
      $body.removeClass(CLASS_MENU);
    });

    $menu.on('click', function(e) {
      e.stopPropagation();
    });
  })
  $('.t199__mmenu').bind('clickedAnchorInTooltipMenu',function(){
    $('body').removeClass('t199__is__menu');
  });
}

function t199_positionHeader(recid){
  var el=$("#rec"+recid);
  var $header = el.find('.t199__js__header'),

    isScrolling = false,

    CLASS_ACTIVE = 't199__is__active';

  function updateHeader() {
    isScrolling = true;

    if ($(window).scrollTop() > 0) $header.addClass(CLASS_ACTIVE);
    else $header.removeClass(CLASS_ACTIVE);
  }

  setInterval(function() {
    if(isScrolling) {
      isScrolling = false;
    }
  }, 100);

  $(window).on('scroll', updateHeader)
  updateHeader();
}

function t199_setPath(pageid){
}

function t199_highlight(recid){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t199__menu a[href='"+url+"']").addClass("t-active");
  $(".t199__menu a[href='"+url+"/']").addClass("t-active");
  $(".t199__menu a[href='"+pathname+"']").addClass("t-active");
  $(".t199__menu a[href='/"+pathname+"']").addClass("t-active");
  $(".t199__menu a[href='"+pathname+"/']").addClass("t-active");
  $(".t199__menu a[href='/"+pathname+"/']").addClass("t-active");
}

function t199_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t199_navLinks = $("#rec"+recid+" .t-menu__link-item:not(.tooltipstered)[href*='#']");
        if (t199_navLinks.length > 0) {
            t199_catchScroll(t199_navLinks);
        }
    }
}

function t199_catchScroll(t199_navLinks) {
    var t199_clickedSectionId = null,
        t199_sections = new Array(),
        t199_sectionIdTonavigationLink = [],
        t199_interval = 100,
        t199_lastCall, t199_timeoutId;
    t199_navLinks = $(t199_navLinks.get().reverse());
    t199_navLinks.each(function() {
        var t199_cursection = t199_getSectionByHref($(this));
        if (typeof t199_cursection.attr("id") != "undefined") {
            t199_sections.push(t199_cursection);
        }
        t199_sectionIdTonavigationLink[t199_cursection.attr("id")] = $(this);
    });
		t199_updateSectionsOffsets(t199_sections);
		$(window).bind('resize', t_throttle(function(){t199_updateSectionsOffsets(t199_sections);}, 200));
		$('.t199').bind('displayChanged',function(){t199_updateSectionsOffsets(t199_sections);});
		setInterval(function(){t199_updateSectionsOffsets(t199_sections);},5000);
    t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);

    t199_navLinks.click(function() {
        if (!$(this).hasClass("tooltipstered")) {
            t199_navLinks.removeClass('t-active');
            t199_sectionIdTonavigationLink[t199_getSectionByHref($(this)).attr("id")].addClass('t-active');
            t199_clickedSectionId = t199_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t199_now = new Date().getTime();
        if (t199_lastCall && t199_now < (t199_lastCall + t199_interval)) {
            clearTimeout(t199_timeoutId);
            t199_timeoutId = setTimeout(function() {
                t199_lastCall = t199_now;
                t199_clickedSectionId = t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);
            }, t199_interval - (t199_now - t199_lastCall));
        } else {
            t199_lastCall = t199_now;
            t199_clickedSectionId = t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId);
        }
    });
}


function t199_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t199_curSection = $(this);
		t199_curSection.attr("data-offset-top",t199_curSection.offset().top);
	});
}


function t199_getSectionByHref(curlink) {
    var t199_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t199_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t199_curLinkValue.substring(1) + "']");
    }
}

function t199_highlightNavLinks(t199_navLinks, t199_sections, t199_sectionIdTonavigationLink, t199_clickedSectionId) {
    var t199_scrollPosition = $(window).scrollTop(),
        t199_valueToReturn = t199_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t199_sections.length != 0 && t199_clickedSectionId == null && t199_sections[t199_sections.length-1].attr("data-offset-top") > (t199_scrollPosition + 300)){
      t199_navLinks.removeClass('t-active');
      return null;
    }

    $(t199_sections).each(function(e) {
        var t199_curSection = $(this),
            t199_sectionTop = t199_curSection.attr("data-offset-top"),
            t199_id = t199_curSection.attr('id'),
            t199_navLink = t199_sectionIdTonavigationLink[t199_id];
        if (((t199_scrollPosition + 300) >= t199_sectionTop) || (t199_sections[0].attr("id") == t199_id && t199_scrollPosition >= $(document).height() - $(window).height())) {
            if (t199_clickedSectionId == null && !t199_navLink.hasClass('t-active')) {
                t199_navLinks.removeClass('t-active');
                t199_navLink.addClass('t-active');
                t199_valueToReturn = null;
            } else {
                if (t199_clickedSectionId != null && t199_id == t199_clickedSectionId) {
                    t199_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t199_valueToReturn;
}
 
function t228_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t228__list_item a[href='"+url+"']").addClass("t-active");
  $(".t228__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"/']").addClass("t-active");
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function(){
              t228_catchScroll(t228_navLinks);
            }, 500);
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection);
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this);
    });
		t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
      return b.attr("data-offset-top") - a.attr("data-offset-top");
    });
		$(window).bind('resize', t_throttle(function(){t228_updateSectionsOffsets(t228_sections);}, 200));
		$('.t228').bind('displayChanged',function(){t228_updateSectionsOffsets(t228_sections);});
		setInterval(function(){t228_updateSectionsOffsets(t228_sections);},5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);

    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
            }, t228_interval - (t228_now - t228_lastCall));
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
        }
    });
}


function t228_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t228_curSection = $(this);
		t228_curSection.attr("data-offset-top",t228_curSection.offset().top);
	});
}


function t228_getSectionByHref(curlink) {
    var t228_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t228_curLinkValue[0]=='/') { t228_curLinkValue = t228_curLinkValue.substring(1); }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t228_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue.substring(1) + "']");
    }
}

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length-1].attr("data-offset-top") > (t228_scrollPosition + 300)){
      t228_navLinks.removeClass('t-active');
      return null;
    }

    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null;
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t228_valueToReturn;
}

function t228_setPath(){
}

function t228_setWidth(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var left_exist=el.find('.t228__leftcontainer').length;
      var left_w=el.find('.t228__leftcontainer').outerWidth(true);
      var max_w=left_w;
      var right_exist=el.find('.t228__rightcontainer').length;
      var right_w=el.find('.t228__rightcontainer').outerWidth(true);
	  var items_align=el.attr('data-menu-items-align');
      if(left_w<right_w)max_w=right_w;
      max_w=Math.ceil(max_w);
      var center_w=0;
      el.find('.t228__centercontainer').find('li').each(function() {
        center_w+=$(this).outerWidth(true);
      });
      var padd_w=40;
      var maincontainer_width=el.find(".t228__maincontainer").outerWidth(true);
      if(maincontainer_width-max_w*2-padd_w*2>center_w+20){
          //if(left_exist>0 && right_exist>0){
		  if(items_align=="center" || typeof items_align==="undefined"){
            el.find(".t228__leftside").css("min-width",max_w+"px");
            el.find(".t228__rightside").css("min-width",max_w+"px");
            el.find(".t228__list").removeClass("t228__list_hidden");
          }
       }else{
          el.find(".t228__leftside").css("min-width","");
          el.find(".t228__rightside").css("min-width","");  
          
      }
    });
  }
}

function t228_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);             
      }
      });
      }else{
        $(".t228").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t228_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t228").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");  
                                el.css("visibility","visible");
                                var topoffset = el.data('top-offset');
                                if (topoffset && parseInt(topoffset) > 0) {
                                    el.animate({"opacity": "1","top": topoffset+"px"}, 200,function() {
                                    });       
                                    
                                } else {
                                    el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                    });       
                                }
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
							el.css("opacity","0");	
                          }
                  }
           });
      }

}

function t228_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t228_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t228"),
      burger=el.find(".t228__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t228_opened")
  })
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
}



 
function t260_init(){
	$(".t260").each(function() {
		var el=$(this);
		if(el.attr('data-block-init')=='yes'){
		}else{
		  el.attr('data-block-init','yes');

          var toggler = el.find(".t260__header");
          var content = el.find(".t260__content");

          toggler.click(function() {
			$(this).toggleClass("t260__opened");
			if($(this).hasClass("t260__opened")==true){
				content.slideDown();
			}else{
				content.slideUp();
			}
          })

		}
	});
} 
function t404_unifyHeights(recid) {
    var el=$('#rec'+recid).find(".t404");
    el.find('.t-container').each(function() {
        var highestBox = 0;
        $('.t404__title', this).css('height', '');
        $('.t404__title', this).each(function(){
            if($(this).height() > highestBox)highestBox = $(this).height();
        });  
        if($(window).width()>=960){
          $('.t404__title',this).css('height', highestBox);   
        }else{
          $('.t404__title',this).css('height', "auto");    
        }
        
        $('.t404__descr', this).css('height', '');
        var highestBox = 0;
        $('.t404__descr', this).each(function(){
            if($(this).height() > highestBox)highestBox = $(this).height(); 
        });  
        if($(window).width()>=960){
          $('.t404__descr',this).css('height', highestBox);   
        }else{
          $('.t404__descr',this).css('height', "auto");    
        }
                
    });
}

function t404_unifyHeightsTextwrapper(recid) {
    var el=$('#rec'+recid).find(".t404");
    el.find('.t-container').each(function() {
        var highestBox = 0;
        $('.t404__textwrapper', this).each(function(){
          $(this).css("height","auto");
            if($(this).height() > highestBox)highestBox = $(this).height(); 
        });  
        if($(window).width()>=960){
          $('.t404__textwrapper',this).css('height', highestBox);   
        }else{
          $('.t404__textwrapper',this).css('height', "auto");    
        }      
    });
}

function t404_showMore(recid) {
  var el=$('#rec'+recid).find(".t404");
  el.find(".t-col").hide();
  var cards_size = el.find(".t-col").size();
  var cards_count=parseInt(el.attr("data-show-count"));
  if (cards_count > 500) { cards_count = 500; }
  var x=cards_count;
  var y=cards_count;
  el.find('.t-col:lt('+x+')').show();
  el.find('.t404__showmore').click(function () {
      x= (x+y <= cards_size) ? x+y : cards_size;
      el.find('.t-col:lt('+x+')').show();
      if(x == cards_size){
          el.find('.t404__showmore').hide();
      }
      $('.t404').trigger('displayChanged');
      if(window.lazy=='y'){t_lazyload_update();}
  });
}



 
function t405_showMore(recid) {
  var el=$('#rec'+recid).find(".t405");
  el.find(".t-col").hide();
  var cards_size = el.find(".t-col").size();
  var cards_count=parseInt(el.attr("data-show-count"));
  if (cards_count > 500) { cards_count = 500; }
  var x=cards_count;
  var y=cards_count;
  el.find('.t-col:lt('+x+')').show();
  el.find('.t405__showmore').click(function () {
      x= (x+y <= cards_size) ? x+y : cards_size;
      el.find('.t-col:lt('+x+')').show();
      if(x == cards_size){
          $(this).hide();
      }
      $('.t405').trigger('displayChanged');
      if(window.lazy=='y'){t_lazyload_update();}
  });
}


 
function t509_setHeight(recid) {  
  var t509__el=$("#rec"+recid);	
  var t509__image = t509__el.find(".t509__blockimg");
  t509__image.each(function() {
    var t509__width = $(this).attr("data-image-width");
    var t509__height = $(this).attr("data-image-height");	
    var t509__ratio = t509__height/t509__width;
    var t509__padding = t509__ratio*100;    	
    $(this).css("padding-bottom",t509__padding+"%");		
  });
  
  if ($(window).width()>960){
    var t509__textwr = t509__el.find(".t509__textwrapper");
    var t509__deskimg = t509__el.find(".t509__desktopimg");
    t509__textwr.each(function() {    
    $(this).css("height", t509__deskimg.innerHeight());	
    });
  }
}
 
function t569_init(recid){
  var el = $('#rec'+recid),
      line = el.find('.t569__line'),
      blocksnumber = el.find('.t569').attr('data-blocks-count'),
      t569_resize;

  if (blocksnumber=='4') {
    var cirqlenumber = 4;
  } else {
    var cirqlenumber = 8;
  }

  line.each(function() {
    var e = $(this).find('.t569__cirqle');
    for (i = 0; i < cirqlenumber; i++) {
      e.clone().insertAfter(e);
    }
  });
                      
  line.css('max-width', $('.t569__col').width() - $('.t569__bgimg').outerWidth());
                                 
  $(window).resize(function() {
    if (t569_resize) clearTimeout(t569_resize);
    t569_resize = setTimeout(function() {
      line.css('max-width', $('.t569__col').width() - $('.t569__bgimg').outerWidth());
    }, 200);        
  });
} 
function t686_init(recid){
	setTimeout(function(){
      t686_setHeight(recid);
    }, 500);
    
	var t686__doResize;
	$(window).resize(function(){
		clearTimeout(t686__doResize);
		t686__doResize = setTimeout(function() {
			t686_setHeight(recid);
		}, 200);
	});
}

function t686_setHeight(recid){
	var t686_el = $('#rec'+recid+' .t686'),
        t686_ratio = t686_el.attr('data-tile-ratio'),
        t686_ratioHeight = t686_el.find('.t686__col').width()*t686_ratio;

	t686_el.find('.t686__row').each(function() {
		var t686_largestHeight = 0,
				t686_currow = $(this);

		$('.t686__table', this).each(function(){
			var t686_curCol = $(this),
          		t686_curColHeight = t686_curCol.find(".t686__textwrapper").outerHeight();
      		if ($(this).find(".t686__cell").hasClass("t686__button-bottom")){ t686_curColHeight+= t686_curCol.find(".t686__button-container").outerHeight(); }
			if(t686_curColHeight > t686_largestHeight){ t686_largestHeight = t686_curColHeight; }
		});

		if($(window).width()>=960){
			if (t686_largestHeight>t686_ratioHeight){ $('.t686__table',this).css('height', t686_largestHeight); }
			else { $('.t686__table',this).css('height', t686_ratioHeight); }
			$('.t686__table',this).css('min-height', 'auto');
		} else {
			$('.t686__table',this).css('min-height', t686_ratioHeight);
			$('.t686__table',this).css('height','');
		}
		
		if (t686_GetIEVersion() > 0){
            var curRowHeight = $('.t686__table',this).css('height');
            $('.t686__bg',this).css('height', curRowHeight);
            $('.t686__overlay',this).css('height', curRowHeight);
        }
	});
}

function t686_GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0) {
      return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
    } else {
      if (!!navigator.userAgent.match(/Trident\/7\./)){
        return 11;
      } else {
        return 0;
      }
    }
}
