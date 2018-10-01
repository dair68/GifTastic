$(document).ready(function () {

    var topics = ["Santa", "Elf", "Snowman", "Present", "Reindeer"];

    //turning everything in topics array into buttons
    function makeButtons() {
        $("#buttons").empty();

        for (var i = 0; i < topics.length; i++) {
            var button = $("<button>");
            button.text(topics[i]);
            button.addClass("gif-button");

            $("#buttons").append(button);
        }
    }

    //submit button. turns the typed text into a new button
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var submission = $("#gifInput").val();
        
        if (!topics.includes(submission) && submission !== "") {
            //clearing input line
            $("#gifInput").val("");
            topics.push(submission);
        }

        makeButtons();
    });

    //produces gifs of button clicked
    $(document).on("click",".gif-button", createGifs);

    function createGifs() {
        console.log("clicked");

        var key = "JLcx2TVC0f6bn9GMyN2u2uLvbY6RZNmf";
        var search = $(this).text();
        var queryUrl = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + key + "&limit=10"; 

        $.ajax({
            url: queryUrl, 
            method:"GET"
        }).done(function(response) {
            //console.log(response);

            var gifs = response.data;
            console.log(gifs);
            $("#gifs").empty();

            //adding gifs to the page
            for(var i=0; i<gifs.length; i++) {
                //obtaining data for gif
                var gif = gifs[i];
                var rating = gif.rating;
                var stillURL = gif.images.fixed_height_still.url;
                var animatedURL = gif.images.fixed_height.url;

                //creating gif
                var img = $("<img />");
                img.attr("src", stillURL);
                img.attr("data-still", stillURL);
                img.attr("data-animated", animatedURL);
                img.attr("alt", search + " gif");
                img.attr("data-status", "still");
                img.addClass("gif");

                var caption = $("<figcaption>");
                caption.text("rating: " + rating);

                var container = $("<figure>");
                container.append(caption);
                container.append(img);
                $("#gifs").prepend(container);
            }
        });
    }

    //toggling between still/animated gifs
    $(document).on("click", ".gif", changeGifState);

    function changeGifState() {
        //animating gif
        if($(this).attr("data-status") === "still") {
            $(this).attr("data-status", "animated");
            var animatedURL = $(this).attr("data-animated");
            $(this).attr("src", animatedURL);
        }
        //making gif still
        else {
            $(this).attr("data-status", "still");
            var stillURL = $(this).attr("data-still");
            $(this).attr("src", stillURL);
        }
    }

    makeButtons();
});