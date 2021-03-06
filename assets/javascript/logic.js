$(document).ready(function () {

    var topics = ["Santa", "Elf", "Snowman", "Present", "Christmas Tree"];
    var buttonRemoveMode = false;
    var animateAll = false;
    var favorites = [];

    //turning everything in topics array into buttons
    function makeButtons() {
        $("#buttons").empty();

        for (var i = 0; i < topics.length; i++) {
            var button = $("<button>");
            button.text(topics[i]);
            button.addClass("gif-button");
            button.attr("data-removal", "keep");

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
            $(this).attr("style", "background: black");
        }
        //user in button removal mode
        else {
            buttonRemoveMode = false;
            $("#remove-instructions").hide();
            $(this).text("Remove");
            $(this).attr("style", "background: blue");

            //removing the selected yellow buttons
            $(".gif-button").each(function () {
                var removalState = $(this).attr("data-removal");
                if (removalState === "remove") {
                    var category = $(this).text();

                    //removing one of the starting buttons
                    if (topics.includes(category)) {
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
    $(document).on("click", ".gif-button", gifButtonHandler);

    //creates gifs if not in removal mode. removes gifbutton in removal mode
    function gifButtonHandler() {
        //remove button not clicked earlier. creating gifs
        if (!buttonRemoveMode) {
            console.log("clicked");

            var key = "JLcx2TVC0f6bn9GMyN2u2uLvbY6RZNmf";
            var search = $(this).text();
            var queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=" + key + "&limit=10";

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
                    img.attr("data-rating", rating);
                    img.addClass("gif");

                    var caption = $("<figcaption>");
                    caption.text("rated " + rating);

                    var favorite = $("<button>");
                    favorite.text("Favorite");
                    favorite.addClass("favorite btn");
                    favorite.attr("data-gif", stillURL);
                    favorite.attr("data-animated", animatedURL);
                    favorite.attr("data-rating", rating);
                    favorite.attr("data-favorite", "unfavorited");

                    //checking if gif already in favorites, and button should be yellow
                    $("#fav-gifs figure").each(function () {
                        url = $(this).attr("data-gif");
                        if (url === favorite.attr("data-gif")) {
                            //changing button color
                            favorite.attr("data-favorite", "favorited");
                            favorite.attr("style", "background: goldenrod");
                        }
                    });

                    var favoriteContain = $("<div>");
                    favoriteContain.addClass("fav-container");
                    favoriteContain.append(favorite);

                    var container = $("<figure>");
                    container.append(caption);
                    container.append(img);
                    container.append("<br>");
                    container.append(favoriteContain);
                    $("#gifs").append(container);
                }
            });
        }
        //button removal mode
        else {
            //toggling between keep/remove state
            var removeState = $(this).attr("data-removal");

            //from keep to remove state
            if (removeState === "keep") {
                $(this).attr("data-removal", "remove");
                $(this).attr("style", "background: black");
            }
            //from remove to keep state
            else {
                $(this).attr("data-removal", "keep");
                $(this).attr("style", "background: goldenrod");
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

    //animates/stops all the main gifs at once
    $("#gifs-area .animate").on("click", function () {
        //animating all the gifs
        if (animateAll === false) {
            $(this).text("Animation: ON");
            animateAll = true;
            $("#gifs .gif").each(function () {
                if ($(this).attr("data-status") === "still") {
                    $(this).attr("data-status", "animated");
                    var animatedURL = $(this).attr("data-animated");
                    $(this).attr("src", animatedURL);
                }
            });
        }
        //stopping all gif animations
        else {
            $(this).text("Animation: OFF");
            animateAll = false;
            $("#gifs .gif").each(function () {
                $(this).attr("data-status", "still");
                var stillURL = $(this).attr("data-still");
                $(this).attr("src", stillURL);
            });
        }
    });

    //animates/stops all the favorite gifs at once
    $("#favorites .animate").on("click", function () {
        //animating all the gifs
        if (animateAll === false) {
            $(this).text("Animation: ON");
            animateAll = true;
            $("#fav-gifs .gif").each(function () {
                if ($(this).attr("data-status") === "still") {
                    $(this).attr("data-status", "animated");
                    var animatedURL = $(this).attr("data-animated");
                    $(this).attr("src", animatedURL);
                }
            });
        }
        //stopping all gif animations
        else {
            $(this).text("Animation: OFF");
            animateAll = false;
            $("#fav-gifs .gif").each(function () {
                $(this).attr("data-status", "still");
                var stillURL = $(this).attr("data-still");
                $(this).attr("src", stillURL);
            });
        }
    });

    //lets user favorite a gif and add to favorites section
    $(document).on("click", ".favorite", manageFavorite);

    //removes gif from favorites section
    $(document).on("click", ".remove-favorite", manageFavorite);

    function manageFavorite() {
        console.log("favorite clicked");

        var favoriteStatus = $(this).attr("data-favorite");

        //adding gif to favorites
        if (favoriteStatus === "unfavorited") {
            //changing button color
            $(this).attr("data-favorite", "favorited");
            $(this).attr("style", "background: goldenrod");

            var stillURL = $(this).attr("data-gif");
            var animatedURL = $(this).attr("data-animated");
            var rating = $(this).attr("data-rating");

            //creating gif
            var img = $("<img />");
            img.attr("src", stillURL);
            img.attr("data-still", stillURL);
            img.attr("data-animated", animatedURL);
            img.attr("data-status", "still");
            img.attr("data-rating", rating);
            img.addClass("gif");

            archiveFavorite(img);

            var caption = $("<figcaption>");
            caption.text("rated " + rating);

            var remove = $("<button>");
            remove.text("Remove");
            remove.addClass("remove-favorite btn");
            remove.attr("data-gif", stillURL);
            remove.attr("data-favorite", "favorited");

            var removeContainer = $("<div>");
            removeContainer.addClass("remove-fav-container");
            removeContainer.append(remove);

            var container = $("<figure>");
            container.attr("data-gif", stillURL);
            container.append(caption);
            container.append(img);
            container.append("<br>");
            container.append(removeContainer);
    
            $("#fav-gifs").append(container);
        }
        //removing gif from favorites
        else {
            console.log("removing");
            var stillURL = $(this).attr("data-gif");

            //setting appropriate button from yellow to black
            $(".favorite").each(function () {
                if (stillURL === $(this).attr("data-gif")) {
                    $(this).attr("data-favorite", "unfavorited");
                    $(this).attr("style", "background: black");
                }
            });

            //searching for appropriate gif to remove
            $("#fav-gifs figure").each(function () {
                var gif = $(this).attr("data-gif");
                console.log(gif);
                console.log(stillURL);
                if (gif === stillURL) {
                    console.log("match found");
                    $(this).remove();
                    terminateFavorite($(this));
                }
            });
        }
    };

    //places an image to favorites array for persistent storage
    //function accepts img elements of gifs.
    function archiveFavorite(gif) {
        var favorite = {
            source: $(gif).attr("src"),
            stillURL: $(gif).attr("data-still"),
            animatedURL: $(gif).attr("data-animated"),
            rating: $(gif).attr("data-rating")
        };

        favorites.push(favorite);
        console.log(favorites);
        localStorage.setItem("favoriteData", JSON.stringify(favorites));
        console.log(localStorage);
    }

    //removes image from favorites array for persistent storage
    //function accepts the FIGURE containing the gif to remove.
    function terminateFavorite(figure) {
        //converting gif to remove into a sort of object
        // console.log(gif);
        var targetGif = $(figure).attr("data-gif");
        console.log(targetGif);

        var updatedFavorites = [];

        //copying over every gif EXCEPT the one to be removed
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].source !== targetGif) {
                updatedFavorites.push(favorites[i]);
            }
        }

        favorites = updatedFavorites;
        // console.log(favorites);
        localStorage.setItem("favoriteData", JSON.stringify(favorites));
        // console.log(localStorage);
    }

    makeButtons();

    //blasting favorites in local storage to the screen
    archivedData = JSON.parse(localStorage.getItem("favoriteData"));

    for (var i = 0; i < archivedData.length; i++) {
        var gifData = archivedData[i];
        favorites.push(gifData);
        // console.log(gifData);

        var stillURL = gifData.stillURL;
        var animatedURL = gifData.animatedURL;
        var rating = gifData.rating;

        //creating gif
        var img = $("<img />");
        img.attr("src", stillURL);
        img.attr("data-still", stillURL);
        img.attr("data-animated", animatedURL);
        img.attr("data-status", "still");
        img.attr("data-rating", rating);
        img.addClass("gif");

        var caption = $("<figcaption>");
        caption.text("rated " + rating);

        var remove = $("<button>");
        remove.text("Remove");
        remove.addClass("remove-favorite btn");
        remove.attr("data-gif", stillURL);
        remove.attr("data-favorite", "favorited");
        //  favorite.attr("data-favorite","unfavorited");
        var removeContainer = $("<div>");
        removeContainer.addClass("remove-fav-container");
        removeContainer.append(remove);

        var container = $("<figure>");
        container.attr("data-gif", stillURL);
        container.append(caption);
        container.append(img);
        container.append("<br>");
        container.append(removeContainer);

        $("#fav-gifs").append(container);
    }
    // console.log(archivedData);
});