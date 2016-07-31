var streamers = ['nvidia', 'izakooo', 'jinx_em', 'markiplier', 'pewdiepie', 'freecodecamp', 'playparagon', 'unrealengine', 'legendoflimitless',
    'mcgrzes', 'shumiifawkes', 'inetkoxtv', 'pashabiceps', 'brunofin', 'esl_sc2', 'bandainamcous', 'urqueeen', 'sawardega'];


$(document).ready(function () {

    createSite();
    var currentStatus;

    $('.status').click(function (e) {
        e.preventDefault();
        currentStatus = $(this).attr('id');
        $('.nav.nav-pills li').removeClass('active');
        $(this).addClass('active');
        showChannels(currentStatus);
    });

    $('#searchBar').keyup(function () {
        showChannels(currentStatus);
    });

    $('#mainPanelFooter').parent().click(scrollTop);

    $('.panel-body .panel-heading').click(function () {
        $('.panel-body .panel-heading').css('opacity', '0.85');
        if($(this).parent().hasClass('collapsed'))
            $(this).css('opacity', '1');
    });
});

function createSite() {

    for (var i = 0; i < streamers.length; i++) {
        $('.panel-body .panel-group').append(this.$fixture = $([
        '<div class="panel panel-default" id="' + streamers[i] + '">',
        '   <a class="collapsed" role="button" data-toggle="collapse" href="#collapse' + i + '" data-parent="#accordion" aria-expanded="false" aria-controls="collapse' + i + '">',
        '       <div class="panel-heading" role="tab" id="heading' + i + '">',
        '           <div class="streamerData">',
        '               <img class="img-responsive icon pull-left" />',
        '               <h2 class="streamerName text-center"></h2>',
        '               <p class="game"></p>',
        '           </div>',
        '       </div>',
        '   </a>',

        '   <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">',
        '       <div class="panel-body">',
        '           <div class="well">',
        '               <h4>CHANNEL IS OFFLINE AT THE MOMENT</h4>',
        '               <a class="btn btn-danger" target="_blank" href="https://www.twitch.tv/' + streamers[i] + '"><i class="fa fa-twitch" aria-hidden="true"></i> Go to channel</a>',
        '           </div>',
        '       </div>',
        '   </div>',
        '</div>',
        ].join("\n")));
    }
    setSite();
}

function setSite() {

    for (var i = 0; i < streamers.length; i++) {
        (function (i) {

            $.getJSON('https://api.twitch.tv/kraken/streams/' + streamers[i] + '?callback=?', function (data) {
                if (data.status != '422') {
                    if (data.stream != null) {
                        $('#' + streamers[i] + ' .streamerData').css('border-color', 'green')
                            .css('-webkit-box-shadow', '0 0 10px 5px rgba(0,255,0, 0.75)').css('-moz-box-shadow', '0 0 10px 5px rgba(0,255,0, 0.75)').css('box-shadow', '0 0 10px 5px rgba(0,255,0, 0.75)');

                        $('#' + streamers[i] + ' .panel-body .well').html(
                                    '<h1 class="title">' + data.stream.channel.status + '</h1>' +
                                    '<p>Game: <strong>' + data.stream.game + '</strong></p>' +
                                    '<p>Viewers: <strong>' + data.stream.viewers + '</strong></p>' +
                                    '<p>Followers: <strong>' + data.stream.channel.followers + '</strong></p>' +
                                    '<p>Language: <strong>' + data.stream.channel.language + '</strong></p><br />' +
                                    '<img class="tvshape img-responsive text-center" src="' + data.stream.preview.large + '" /><br /><br />' +
                                    '<a class="btn btnTwitch" target="_blank" href="' + data.stream.channel.url + '"><i class="fa fa-twitch" aria-hidden="true"></i> Watch</a>')
                    }
                } else {
                    $('#' + streamers[i] + ' .streamerData').css('border-color', 'rgba(89,55,24, 1)')
                            .css('-webkit-box-shadow', '0 0 10px 5px rgba(89,55,24, 1))').css('-moz-box-shadow', '0 0 10px 5px rgba(89,55,24, 1)').css('box-shadow', '0 0 25px 5px rgba(89,55,24, 1)');
                    $('#' + streamers[i] + ' .panel-body .well').html('<h1 class="title">Account closed!</h1>')
                }


                $.getJSON('https://api.twitch.tv/kraken/channels/' + streamers[i] + '?callback=?', function (innerData) {

                    $('#' + streamers[i] + ' .icon').attr('src', (innerData.logo == null) ? 'images/twitchIcon.png' : innerData.logo);
                    $('#' + streamers[i] + ' .streamerName').html(streamers[i]);
                    $('#' + streamers[i] + ' .game').html(data.status == '422' ? 'Account closed!' : innerData.game);
                    $('#' + streamers[i] + ' .panel-heading').css('background', 'url("' + (innerData.profile_banner == null ? innerData.video_banner : innerData.profile_banner) + '") no-repeat center').css('background-size', '100%');
                    sortChannels();
                });

            });
        })(i);
    }
}

function showChannels(status) {

    var patt = new RegExp($('#searchBar').val(), "i");

    $('.panel-body .panel.panel-default').css('display', 'none');

    $('.panel-body .panel.panel-default').each(function (index) {

        if (status == 'Offline') {
            if ($(this).find(".streamerData").css('border-color') == 'rgb(255, 0, 0)') {
                if (patt.test($(this).find("h2").text())) {
                    $(this).css('display', 'block');
                }
                else {
                    $(this).css('display', 'none');
                }
            }
        } else if (status == 'Online') {
            if ($(this).find(".streamerData").css('border-color') == 'rgb(0, 128, 0)') {
                if (patt.test($(this).find("h2").text())) {
                    $(this).css('display', 'block');
                }
                else {
                    $(this).css('display', 'none');
                }
            }
        } else {
            if (patt.test($(this).find("h2").text())) {
                $(this).css('display', 'block');
            }
            else {
                $(this).css('display', 'none');
            }
        }
    });
}

function sortChannels() {
    for (var i = 0; i < streamers.length; i++) {
        if ($('#' + streamers[i] + ' .streamerData').css('border-color') == 'rgb(0, 128, 0)') {
            $('#' + streamers[i]).parent().prepend($('#' + streamers[i]));
        } else if ($('#' + streamers[i] + ' .streamerData').css('border-color') == 'rgb(89, 55, 24)') {
            $('#' + streamers[i]).parent().append($('#' + streamers[i]));
        }
    }
}

function scrollTop(e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: 0
    }, 400);
}