/*  TABLE OF CONTENT
    1. Common function
    2. Initialing
*/
/*================================================================*/
/*  1. Common function
/*================================================================*/
function path(){
    var args = arguments,result = [];
    for(var i = 0; i < args.length; i++)
        result.push(args[i].replace('@', '/assets/js/syntaxhighlighter/'));
    return result;
};
var ghostApp={
    filterSetup: function(){
        var $filterControl=$('#filter ul');
        var lastActiveTag='*';
        var filters=[];
        var i=0;
        var filterItemStr='';
        var activeClassStr='';
        if($filterControl.find('>li >a.active').length && rememberLastActiveTag){
            lastActiveTag=$filterControl.find('>li >a.active').data('filter');
        }
        $filterControl.html('<li>\
                                <a href="#" data-filter="*" class="btn btn-theme filter-item">\
                                    <i class="fa fa-reorder"></i> All Posts\
                                </a>\
                            </li>');
        $('.post').each(function(){
            var tagList='';
            if($(this).data('tags')){
                tagList=$(this).data('tags');
            }
            if(tagList.length>0){
                var tags=tagList.split(',');
                for (i = 0; i < tags.length; i++) {
                    if(tags[i]!=''){
                        var tagOj= {"tagName": tags[i],"total": 1};
                        var hasOld=false;
                        for(var j=0; j<filters.length; j++){
                            if(filters[j].tagName==tags[i]){
                                tagOj.total=filters[j].total+1;
                                filters[j]=tagOj;
                                hasOld=true;
                            }
                        }
                        if(!hasOld)
                            filters.push(tagOj);
                    }
                }
            }
        });
        for (i = 0; i < filters.length; i++) {
            activeClassStr='';
            var curFilterStr='.tag-'+filters[i].tagName.toLowerCase().replace(' ','-');
            if(lastActiveTag!=='*' && rememberLastActiveTag && lastActiveTag===curFilterStr){
                activeClassStr='active';
            }
            filterItemStr=' <li><a href="#" data-filter="'+curFilterStr+'" class="btn btn-theme filter-item '+activeClassStr+'">';
            filterItemStr+=filters[i].tagName;
            if(enable_tag_count){
                filterItemStr+=' ('+filters[i].total+')';
            }
            filterItemStr+='</a></li>';
            $filterControl.append(filterItemStr);
        }
        if(lastActiveTag!=='*' && rememberLastActiveTag){
            $("#filter ul li a[data-filter='"+lastActiveTag+"']").trigger('click');
        }
        else{
            $("#filter ul li a[data-filter='*']").trigger('click');
        }
    },
    responsiveImages:function(){
        $('.post').each(function(){
            if($(this).find('img').length){
                $(this).find('img').addClass('img-responsive');
            }
        });
    },
    reformatPost:function(){
        if($('.post').length){
            $('.post .wrap:not(.formated)').each(function() {
                if($(this).find('.post-excerpt').has('img').length){
                    var $excerpt=$('.post-excerpt',$(this));
                    var $postImg=$excerpt.find('img');
                    var postUrl=$(this).find('.post-title a').attr('href');
                    $excerpt.prepend('<div class="post-photo"></div>');
                    var $postPhoto=$('.post-photo',$excerpt);
                    $postImg.prependTo($postPhoto);
                    var maskStr='<div class="mask">\
                                    <a class="preview" href="'+$postImg.attr('src')+'" rel="prettyPhoto">\
                                        <i class="fa fa-search"></i>\
                                    </a>\
                                    <a class="detail" href="'+postUrl+'">\
                                        <i class="fa fa-link"></i>\
                                    </a>\
                                </div>';
                    $postPhoto.append(maskStr);
                    $(this).addClass('formated');
                    $("a[rel^='prettyPhoto']", $(this)).prettyPhoto({
                        theme: 'light_square', //<-- change your theme of prettyPhoto popup here-->
                        allow_resize: true,
                    });
                }
                if($(this).find(".post-excerpt").has('iframe[src^="//www.youtube.com"]').length){
                    var $excerpt=$('.post-excerpt',$(this));
                    var $youtube=$excerpt.find("iframe:first-child");
                    $excerpt.prepend('<div class="post-video"></div>');
                    var $postYoutube=$('.post-video',$excerpt);
                    $youtube.prependTo($postYoutube);
                    $(this).addClass('formated');
                }
                if($(this).find(".post-excerpt").has('iframe[src^="https://w.soundcloud.com"]').length){
                    var $excerpt=$('.post-excerpt',$(this));
                    var $soundcloud=$excerpt.find("iframe:first-child");
                    $excerpt.prepend('<div class="post-audio"></div>');
                    var $postSoundcloud=$('.post-audio',$excerpt);
                    $soundcloud.prependTo($postSoundcloud);
                    $(this).addClass('formated');
                }
                if($(this).find(".post-excerpt").has('iframe[src^="//player.vimeo.com"]').length){
                    var $excerpt=$('.post-excerpt',$(this));
                    var $vimeo=$excerpt.find("iframe:first-child");
                    $excerpt.prepend('<div class="post-video"></div>');
                    var $postVimeo=$('.post-video',$excerpt);
                    $vimeo.prependTo($postVimeo);
                    $(this).addClass('formated');
                }
            });
            ghostApp.updateCommentCount();
        }
    },
    getMaxPagination:function(){
        var numberPattern = /\d+/g;
        var pageNumberStr=$('.page-number').html();
        var result=pageNumberStr.match(numberPattern);
        if(result!=null && result.length>1){
            return result[1];
        }
        else{
            return 1;
        }
    },
    getRecentPosts:function(){
        if($('.recent-post').length){
            $('.recent-post').each(function(){
                var $this=$(this);
                var showPubDate=false;
                var showDesc=false;
                var descCharacterLimit=-1;
                var size=-1;
                var type='static';
                var slideMode='horizontal';
                var slideSpeed=500;
                var slidePager=false;
                var isTicker=false;
                if($this.data('pubdate'))
                    showPubDate=$this.data('pubdate');
                if($this.data('desc')){
                    showDesc=$this.data('desc');
                    if($this.data('character-limit'))
                        descCharacterLimit=$this.data('character-limit');
                }
                if($this.data('size'))
                    size=$this.data('size');
                if($this.data('type'))
                    type=$this.data('type');
                if(type==='scroll'){
                    if($this.data('mode'))
                        slideMode=$this.data('mode');
                    if($this.data('speed'))
                        slideSpeed=$this.data('speed');
                    if($this.data('pager'))
                        slidePager=$this.data('pager');
                    if($this.data('ticker'))
                        isTicker=$this.data('ticker');
                }
                $.ajax({
                    type: 'GET',
                    url: '/rss/',
                    dataType: "xml",
                    success: function(xml) {
                        if($(xml).length){
                            var htmlStr='';
                            var date;
                            var count=0;
                            $('item', xml).each( function() {
                                if(size>0 && count < size){
                                    htmlStr += '<li>\
                                                    <div class="itemTitle">\
                                                        <a href="' + $(this).find('link').eq(0).text() + '">\
                                                        ' + $(this).find('title').eq(0).text() + '\
                                                        </a>\
                                                    </div>';
                                    if(showPubDate){
                                        date = new Date($(this).find('pubDate').eq(0).text());
                                        htmlStr += '<div class="itemDate">' + date.toLocaleDateString() + "</div>";
                                    }
                                    if (showDesc) {
                                        var desc=$(this).find('description').eq(0).text();
                                        // trip html tag
                                        desc=$(desc).text();
                                        if (descCharacterLimit > 0 && desc.length > descCharacterLimit) {
                                            htmlStr += '<div class="itemContent">' + desc.substr(0, descCharacterLimit) + ' ... <a class="read-more" href="' + $(this).find('link').eq(0).text() + '">Read more »</a></div>';
                                        }
                                        else{
                                            htmlStr += '<div class="itemContent">' + desc + '</div>';
                                        }
                                    }
                                    htmlStr += '</li>';
                                    count++;
                                }
                                else{
                                    return false;
                                }
                            });
                            if(type==='static')
                                htmlStr='<ul class="feedList static">'+ htmlStr + "</ul>";
                            else{
                                htmlStr='<ul class="feedList bxslider">'+ htmlStr + "</ul>";
                            }
                            $this.append(htmlStr);
                            if(type!=='static'){
                                // Updating on v1.2
                            }
                        }
                    }
                });
            });
        }
    },
    getFlickr:function(){
        if($('.flickr-feed').length){
            var count=1;
            $('.flickr-feed').each(function() {
                if(flickr_id=='' || flickr_id=='YOUR_FLICKR_ID_HERE'){
                    $(this).html('<li><strong>Please change Flickr user id before use this widget</strong></li>');
                }
                else{
                    var feedTemplate='<li><a href="{{image_b}}" target="_blank"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                    var size=15;
                    if($(this).data('size'))
                        size=$(this).data('size');
                    var isPopupPreview=false;
                    if($(this).data('popup-preview'))
                        isPopupPreview=$(this).data('popup-preview');
                    if(isPopupPreview){
                        feedTemplate='<li><a href="{{image_b}}" rel="prettyPhoto[flickr_'+count+']"><img src="{{image_m}}" alt="{{title}}" /></a></li>';
                        count++;
                    }
                    $(this).jflickrfeed({
                        limit: size,
                        qstrings: {
                            id: flickr_id
                        },
                        itemTemplate: feedTemplate
                    }, function(data) {
                        if(isPopupPreview){
                            $("a[rel^='prettyPhoto']", $(this)).prettyPhoto({
                                theme: 'light_square', //<-- change your theme of prettyPhoto popup here-->
                                allow_resize: true,
                            });
                        }
                    });
                }
            });
        }
    },
    getInstagram: function(){
        if($('.instagram-feed').length){
            if(instagram_accessToken!='' || instagram_accessToken!='your-instagram-access-token'){
                /* Initalize Instagram Feed */
                $.fn.spectragram.accessData = {
                    accessToken: instagram_accessToken,
                    clientID: instagram_clientID
                };
            }
            $('.instagram-feed').each(function(){
                if(instagram_accessToken=='' || instagram_accessToken=='your-instagram-access-token'){
                    $(this).html('<li><strong>Please change instagram api access info before use this widget</strong></li>');
                }
                else{
                    var display=15;
                    var wrapEachWithStr='<li></li>';
                    if($(this).data('display'))
                        display=$(this).data('display');
                    $(this).spectragram('getRecentTagged',{
                        query: 'converse',
                        max: display
                    });
                }
            });
        }
    },
    getDribbble: function(){
        if($('.dribbble-feed').length){
            var count=1;
            $('.dribbble-feed').each(function(){
                var $this=$(this);
                var display=15;
                if($this.data('display'))
                    display=$this.data('display');
                var isPopupPreview=false;
                if($this.data('popup-preview'))
                    isPopupPreview=$this.data('popup-preview');
                $.jribbble.getShotsByList('popular', function (listDetails) {
                    var html = [];
                    $.each(listDetails.shots, function (i, shot) {
                        if(isPopupPreview){
                            html.push('<li><a href="' + shot.image_url + '" rel="prettyPhoto[dribbble_'+count+']">');
                        }
                        else{
                            html.push('<li><a href="' + shot.url + '">');
                        }
                        html.push('<img src="' + shot.image_teaser_url + '" ');
                        html.push('alt="' + shot.title + '"></a></li>');
                    });
                    $this.html(html.join(''));
                    if(isPopupPreview){
                        $("a[rel^='prettyPhoto']", $this).prettyPhoto({
                            theme: 'light_square', //<-- change your theme of prettyPhoto popup here-->
                            allow_resize: true,
                        });
                        count++;
                    }
                }, {page: 1, per_page: display});
            });
        }
    },
    isotopeSetup:function(){
        if($('#isotope-content').length){
            var $container = $('#isotope-content');
             $('.post').imagesLoaded()
            .done( function( instance ) {
                $container.isotope({
                    filter: '*',
                    animationOptions: {
                       duration: 750,
                       easing: 'linear',
                       queue: false,
                    }
                });
                $('#filter ul li:first-child a').trigger('click');
            });
            $container.infinitescroll({
                navSelector     : '.pagination',    // selector for the paged navigation
                nextSelector    : '.pagination a',  // selector for the NEXT link (to page 2)
                itemSelector    : '.post',     // selector for all items you'll retrieve
                maxPage           : ghostApp.getMaxPagination(),
                loading: {
                    finishedMsg: 'No more post to load.',
                        img: '/assets/img/loader.gif'
                }
            },
            // call Isotope as a callback
            function( newElements ) {
                $container.isotope('insert', $(newElements),function(){
                    ghostApp.responsiveImages();
                    ghostApp.reformatPost();
                    $(".post .wrap").fitVids();
                    ghostApp.filterSetup();
                });
            });
        }
    },
    fitVids:function(){
        $(".post .wrap").fitVids();
        $(".post").fitVids();
    },
    updateCommentCount:function(){
        if($('.disqus-comment-count').length){
            var urlArray = [];
            $('.disqus-comment-count').each(function () {
              var url = $(this).attr('data-disqus-url');
              urlArray.push('link:' + url);
            });
            $.ajax({
                type: 'GET',
                url: "http://disqus.com/api/3.0/threads/set.jsonp",
                data: { api_key: disqusPublicKey, forum : disqusShortname, thread : urlArray },
                cache: false,
                dataType: 'jsonp',
                success: function (result) {
                    for (var i in result.response) {
                        if(result.response[i].forum==disqusShortname){
                            var countText = " comments";
                            var count = result.response[i].posts;
                            if (count <= 1)
                              countText = " comment";
                            $('span[data-disqus-url="' + result.response[i].link + '"]').html(count + countText);
                        }
                    }
                }
            });
        }
        else if(window.FB){
            FB.XFBML.parse(document.body);
        }
        else if($('.gplus-comment-count').length){
            var count=1;
            $('.gplus-comment-count').each(function(){
                $(this).attr('id', 'commentscounter'+count);
                gapi.commentcount.render('commentscounter'+count, {
                    href: $(this).data('href'),
                    color: $(this).data('color')
                });
                count++;
            });
        }
    },
    syntaxHighlighter:function(){
        SyntaxHighlighter.autoloader.apply(null, path(
            'applescript            @shBrushAppleScript.js',
            'actionscript3 as3      @shBrushAS3.js',
            'bash shell             @shBrushBash.js',
            'coldfusion cf          @shBrushColdFusion.js',
            'cpp c                  @shBrushCpp.js',
            'c# c-sharp csharp      @shBrushCSharp.js',
            'css                    @shBrushCss.js',
            'delphi pascal          @shBrushDelphi.js',
            'diff patch pas         @shBrushDiff.js',
            'erl erlang             @shBrushErlang.js',
            'groovy                 @shBrushGroovy.js',
            'java                   @shBrushJava.js',
            'jfx javafx             @shBrushJavaFX.js',
            'js jscript javascript  @shBrushJScript.js',
            'perl pl                @shBrushPerl.js',
            'php                    @shBrushPhp.js',
            'text plain             @shBrushPlain.js',
            'py python              @shBrushPython.js',
            'powershell ps posh     @shBrushPowerShell.js',
            'ruby rails ror rb      @shBrushRuby.js',
            'sass scss              @shBrushSass.js',
            'scala                  @shBrushScala.js',
            'sql                    @shBrushSql.js',
            'vb vbnet               @shBrushVb.js',
            'xml xhtml xslt html    @shBrushXml.js'
        ));
        SyntaxHighlighter.all();
    },
    mainMenuEvents:function(){
        if($('.main-nav').length){
            var currentUrl=window.location.href;
            var $currentMenu=$('.main-nav a[href="'+currentUrl+'"]');
            if($currentMenu.length){
                $('.main-nav li.active').removeClass('active');
                $currentMenu.parent().addClass('active');
            }
        }
    },
    misc:function(){
        $("a[rel^='prettyPhoto']").prettyPhoto({
            theme: 'light_square',
            allow_resize: true,
        });
        if($('#gmap').length){
        $('#gmap').gMap({
            latitude: your_latitude,
            longitude : your_longitude,
            maptype: 'TERRAIN', // 'HYBRID', 'SATELLITE', 'ROADMAP' or 'TERRAIN'
            zoom: 14,
            controls: {
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false
            },
            markers: [{
                latitude: your_latitude,
                longitude: your_longitude
            }]
        });
    }
    },
    init: function () {
        ghostApp.responsiveImages();
        ghostApp.reformatPost();
        ghostApp.fitVids();
        ghostApp.isotopeSetup();
        ghostApp.filterSetup();
        ghostApp.getRecentPosts();
        ghostApp.getFlickr();
        ghostApp.getInstagram();
        ghostApp.getDribbble();
        ghostApp.syntaxHighlighter();
        ghostApp.mainMenuEvents();
        ghostApp.misc();
    }
};

/*================================================================*/
/*  2. Initialing
/*================================================================*/
$(document).ready(function() {
    ghostApp.init();
    // Filter click event
    $(document).on('click','.filter-item',function(e){
        var $container = $('#isotope-content');
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });
        $('a.active').removeClass('active');
        $(this).addClass('active');
        return false;
    });
    // BackToTop Button click event
    $('.totop').click(function () {
        $("html, body").animate({scrollTop: 0}, 800);
        return false;
    });
    // Submit event
    $("#mc-form input").not("[type=submit]").jqBootstrapValidation({
        submitSuccess: function ($form, event) {
            var url=$form.attr('action');
            if(url=='' || url=='YOUR_WEB_FORM_URL_HERE')
            {
                alert('Please config your mailchimp form url for this widget');
                return false;
            }
            else{
                url=url.replace('/post?', '/post-json?').concat('&c=?');
                var data = {};
                var dataArray = $form.serializeArray();
                $.each(dataArray, function (index, item) {
                    data[item.name] = item.value;
                });
                $.ajax({
                    url: url,
                    data: data,
                    success: function(resp){
                        if (resp.result === 'success') {
                            alert("Got it, you've been added to our newsletter. Thanks for subscribe!");
                        }
                        else{
                            alert(resp.result);
                        }
                    },
                    dataType: 'jsonp',
                    error: function (resp, text) {
                        console.log('mailchimp ajax submit error: ' + text);
                    }
                });
                return false;
            }
        }
    });
});