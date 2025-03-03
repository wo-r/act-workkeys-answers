(async function ($, window, document) {
    "use strict";

    function listWorkKeys() {
        $.getJSON("./res/key.json", function (keys) {
            $.each(keys, function (i, key) {

                $("#__workkeys").append(`
                    <div uid="${key.id}" class="p-5 bg-zinc-100 rounded-lg">
                        <span question class="flex flex-col w-full gap-2">${key.question_content.replace("Q.", "")}</span>
                        <div class="flex flex-col gap-1 no-break mt-5">
                            ${(() => {
                        let choiceHTML = "";

                        try {
                            choiceHTML += `<div class="w-fit p-2 rounded-md ${key.answer == "A" ? "bg-green-300" : "bg-red-300"}">A. ${key.choices.choice[0].a}</div>`
                            choiceHTML += `<div class="w-fit p-2 rounded-md ${key.answer == "B" ? "bg-green-300" : "bg-red-300"}">B. ${key.choices.choice[1].b}</div>`
                            choiceHTML += `<div class="w-fit p-2 rounded-md ${key.answer == "C" ? "bg-green-300" : "bg-red-300"}">C. ${key.choices.choice[2].c}</div>`
                            choiceHTML += `<div class="w-fit p-2 rounded-md ${key.answer == "D" ? "bg-green-300" : "bg-red-300"}">D. ${key.choices.choice[3].d}</div>`
                        } catch (e) { }

                        return choiceHTML;
                    })()}
                        </div>
                    </div>
                `);

            })
        })
    }

    async function initalizeAlternateLinks() {
        $("[goto]").click(function () {
            var goto = $(this).attr("goto");
            if (goto === "#" || goto === "") return;
            if (goto.startsWith("https://")) {
                window.open(goto, "_blank");
            } else if (goto.startsWith("#")) {
                if (goto.length) {
                    elementsManager.body.parent().animate({
                        scrollTop: $($(this).attr("goto")).offset().top - elementsManager.body.offset().top - 200,
                    }, 800);
                }
            } else if (goto.startsWith("/")) {
                window.location.href = goto;
            } else if (goto.startsWith("mailto:")) {
                window.location.href = goto;
            }
        })
    }

    async function initalizeSearchEngine() {
        $("#__search").on("input", function () {
            var search = $(this).val().trim().toLowerCase();
            var hasResults = false;

            $("[uid]").each(function () {
                var elementBody = $(this);
                var originalText = elementBody.data("original-text");

                if (!originalText) {
                    elementBody.data("original-text", elementBody.html());
                    originalText = elementBody.html();
                }

                if (search.length === 0) {
                    elementBody.html(originalText).fadeIn(300);
                    hasResults = true;

                } else {
                    var text = elementBody.text().toLowerCase();
                    if (text.includes(search)) {
                        var regex = new RegExp(`(${search})`, "gi");
                        var highlightedText = originalText.replace(regex, '<span class="bg-yellow-300 bg-opacity-40">$1</span>');
                        elementBody.html(highlightedText);
                        elementBody.fadeIn(300);
                        hasResults = true;
                    } else {
                        elementBody.fadeOut(300);
                    }
                }
            });

            if (hasResults != true) {
                $("#__noResult").length == 0 ? $("#__workkeys").append(`
                    <div id="__noResult" class="p-5 bg-zinc-100 rounded-lg">
                        <span>No result was found for "<span id="__noResultText"></span>"</span>
                    </div>
                `) : "";

                $("#__noResultText").text(search);
            } else {
                $("#__noResult").remove();
            }
        });
    }

    $(window).ready(async function () {
        initalizeAlternateLinks();
        initalizeSearchEngine();
        listWorkKeys();

        $("#__currentYear").text(new Date().getFullYear());
    })
})(jQuery, window, document);