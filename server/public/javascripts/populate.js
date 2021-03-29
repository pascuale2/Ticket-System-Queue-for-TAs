$(document ).ready(function() {
    let dropdown = $('#courseComboBox');

    dropdown.empty();
    dropdown.append('<option selected="true" disabled>Select Course</option>');
    dropdown.prop('selectedIndex',0);

    $.getJSON(url, function(data)){
        $.get(data, function(key, entry)){
            dropdown.append($('<option></option>')).attr('value', entry.abbreviation).text(entry.name));
        })
    });
});



