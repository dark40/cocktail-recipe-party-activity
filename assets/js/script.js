// Function to toggle modal prompting user that cockatil has not been found
function noCocktail() {
    $('#modal').modal('toggle');
}

// Function for autocomplete cocktail search
$( function() {
    var availableCocktails = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( "#userInput" ).autocomplete({
      source: availableCocktails
    });
  } );
