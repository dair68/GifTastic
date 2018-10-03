$(document).ready(function () {

    var topics = ["Santa", "Elf", "Snowman", "Present", "Christmas Tree"];
    var buttonRemoveMode = false;

    //turning everything in topics array into buttons
    function makeButtons() {
        $("#buttons").empty();

        for (var i = 0; i < topics.length; i++) {
            var button = $("<button>");
            button.text(topics[i]);
            button.addClass("gif-button");
            button.attr("data-removal","keep");

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

    //removes yellow gif buttons from interface
    $("#remove").on("click", function (event) {
        event.preventDefault();
        
        //user not already in button remove mode
        if (!buttonRemoveMode) {
            //entering button remove mode. buttons can be selected to be deleted
            buttonRemoveMode = true;
            $("#remove-instructions").show();
            $(this).text("Remove Items");
            $(this).attr("style","background: black");
        }
        //user in button removal mode
        else {
            buttonRemoveMode = false;
            $("#remove-instructions").hide();
            $(this).text("Remove");
            $(this).attr("style", "background: blue");

            //removing the selected yellow buttons
            $(".gif-button").each(function() {
                var removalState = $(this).attr("data-removal");
                if(removalState === "remove") {
                    var category = $(this).text();

                    //removing one of the starting buttons
                    if(topics.includes(category)) {
                        topics.splice(topics.indexOf(category), 1);
                    }
                    $(this).remove();
                }
            });

            //removing already present
            $("#gifs").empty();
        }
    });

    //handles click event of yellow buttons
    $(document).on("click", ".gif-button", gifHandler);

    //creates gifs if not in removal mode, toggles between removal/not removal otherwise.
    function gifHandler() {
        //remove button not clicked earlier
        if (!buttonRemoveMode) {
            console.log("clicked");

            var key = "JLcx2TVC0f6bn9GMyN2u2uLvbY6RZNmf";
            var search = $(this).text();
            var queryUrl = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + key + "&limit=10";

            $.ajax({
                url: queryUrl,
                method: "GET"
            }).done(function (response) {
                //console.log(response);

                var gifs = response.data;
                console.log(gifs);
                $("#gifs").empty();

                //adding gifs to the page
                for (var i = 0; i < gifs.length; i++) {
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
                    img.attr("data-status", "still");
                    img.addClass("gif");

                    var caption = $("<figcaption>");
                    caption.text("rated " + rating);

                    var container = $("<figure>");
                    container.append(caption);
                    container.append(img);
                    $("#gifs").prepend(container);
                }
            });
        }
        //button removal mode
        else {
            //toggling between keep/remove state
            var removeState = $(this).attr("data-removal");

            //from keep to remove state
            if (removeState === "keep") {
                $(this).attr("data-removal","remove");
                $(this).attr("style","background: black");
            }
            //from remove to keep state
            else {
                $(this).attr("data-removal","keep");
                $(this).attr("style","background: goldenrod");
            }
        }
    }

    //toggling between still/animated gifs
    $(document).on("click", ".gif", changeGifState);

    function changeGifState() {
        //animating gif
        if ($(this).attr("data-status") === "still") {
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

    //hovering mouse over gif will animate it
    $(document).on("mouseover", ".gif", gifPreview);

    function gifPreview() {
        //animating gif
        if ($(this).attr("data-status") === "still") {
            // $(this).attr("data-status", "animated");
            var animatedURL = $(this).attr("data-animated");
            $(this).attr("src", animatedURL);
        }
    }

    //taking mouse off gif without clicking will set back to static
    $(document).on("mouseleave", ".gif", endPreview);

    function endPreview() {
        //stopping gif animation
        if ($(this).attr("data-status") === "still") {
            // $(this).attr("data-status", "still");
            var stillURL = $(this).attr("data-still");
            $(this).attr("src", stillURL);
        }
    }

    makeButtons();
});