/**
 * Small file that converts json files for me
 */

"use strict";


var target = "../res/applied-math-key.json" // file path


// function to write to our result element
function write(data) {
    $("#result").html(JSON.stringify(data, null, 1))
}


$(window).ready(function () {



    // read the target file
    $.getJSON(target, function (k) {

        let a = [];

        // each identifiers
        $.each(k, function (i, s) {

            var question_content_splice = s.question_content.replace(/<div\b[^>]*>[\s\S]*?<\/div>/g,"").replace("</div>","").split("<ol>")[0]

            // reformat the json to only include whats important
            var r = {
                id: s.id,
                question_content: question_content_splice,
                answer: atob(s.correct_answer),
                answer_content: decodeURIComponent(escape(atob(s.answer_content))),
                choices: {
                    total: s.choices_count,
                    choice: [],
                }
            }



            // get a, b, c, d answers

            try {

                var question_mtc_splice = s.question_content.replace(/<div\b[^>]*>[\s\S]*?<\/div>/g,"").replace("</div>","").split("</ol>")[0].replace(/<li>/g,"").split("<ol>")[1].split("</li>")


                r.choices.choice.push({a: question_mtc_splice[1]})
                r.choices.choice.push({b: question_mtc_splice[2]})
                r.choices.choice.push({c: question_mtc_splice[3]})
                r.choices.choice.push({d: question_mtc_splice[4]})

            } catch (e) {}

            a.push(r);

        })
        

        write(a)

    })


    
})