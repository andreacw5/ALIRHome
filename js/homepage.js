/*
*
*                                   ALIRHome
*
*                                 MIT License
*
*    Copyright (c) 2018 Andrea Zago
*
*    Permission is hereby granted, free of charge, to any person obtaining a copy
*    of this software and associated documentation files (the "Software"), to deal
*    in the Software without restriction, including without limitation the rights
*    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*    copies of the Software, and to permit persons to whom the Software is
*    furnished to do so, subject to the following conditions:
*
*    The above copyright notice and this permission notice shall be included in all
*    copies or substantial portions of the Software.
*
*    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*    SOFTWARE.
*
*/

console.log("Avvio ALIRHome, utilizzare la console solo per scopi di sviluppo, non trasmettere i propri dati personali o bancari!");

// auth
var requestUser = "alirgoggles";
var requestPass = "apritisesamo";
var authLogin = "Basic " + btoa(requestUser + ":" + requestPass);

moment.locale('it');

$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});

function generateNews() {

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://37.59.102.107:8190/rssFeed/discussioni",
        type: 'GET',
        dataType: "json",
        timeout: 5000,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", authLogin);
        }
    }).done(function (data) {

        var result = data.items;
        appendArticles(result);

    });

}

function requestStaffNews() {

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://37.59.102.107:8190/rssFeed/annunci",
        type: 'GET',
        dataType: "json",
        timeout: 5000,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", authLogin);
        }
    }).done(function (data) {

        var result = data.items;
        appendHeading(result);

    });

}

function appendHeading(data) {

    for (var i = 0; i < data.length; i++) {

        var topicTitle = data[i].title;
        var topicUrl = data[i].url;
        var firstDate = data[i].created;
        var date = moment(firstDate).fromNow();

        var $cardTitle = $('#card' + i + 'title');
        var $cardInfo = $('#card' + i + 'info');
        var $cardSelector = $('#card' + i + 'select');
        var $cardImage = $('#card' + i + 'image');
        var armaImage = "https://pacificgl.com/images/arma3_2.jpg";

        $cardTitle.html(topicTitle).attr('href', topicUrl).attr('title', 'Clicca per leggere la notizia');
        $cardInfo.html("<small class='text-muted textgray'><i class='fas fa-clock' title='Scritto'></i> " + date + "</small>");
        $cardImage.attr('src', armaImage);
        $cardSelector.animateCss('flipInY');

    }

}

function appendArticles(data) {

    for (var i = 0; i < data.length; i++) {

        var topicTitle = data[i].title;
        var topicUrl = data[i].url;
        var firstDate = data[i].created;
        var content = data[i].description;
        var contentLenght = content.length;
        var date = moment(firstDate).fromNow();

        if(contentLenght >= 201){
            content = content.substring(0,200) + "... ";
        }

        var $cardSelector = $('#card' + i + 'selected');
        var $cardTitle = $('#card' + i + 'newstitle');
        var $cardSubTitle = $('#card' + i + 'newssub');
        var $cardContentText = $('#card' + i + 'newstext');
        var $cardTime = $('#card' + i + 'newstimer');
        var linkElement = "<a class='pull-right' href='" + topicUrl + "'>" + topicTitle + "</a>";

        $cardTitle.html(linkElement);
        $cardSubTitle.html("");
        $cardContentText.html("<p class='card-text'>" + content + "</p>").attr('hidden', false).animateCss('flipInY');
        $cardTime.html("<div class='mb-1  text-muted'>Scritto " + date + "</div> ");
        $cardSelector.animateCss('flipInY');

    }

    $('#loadPost').attr('hidden', true);

}

$(document).ready(function () {

    setTimeout(function () {
        generateNews();
        requestStaffNews();
    }, 10000);

});