$(document).ready(function() {
    $('#courseComboBox').on('change', function () {
        selectedVal = $('#courseComboBox').val();
        if (selectedVal == '') {
            $('#submit_button').prop('disabled', true);
            $('#clear_button').prop('disabled', true);
        } else {
            $('#submit_button').prop('disabled', false);
            $('#clear_button').prop('disabled', false);
        }
    })

    $('#clear_button').click(function () {
        $('#submit_button').prop('disabled', true);
        $('#clear_button').prop('disabled', true);
        $('#courseComboBox').prop('selectedIndex', 0);
    })
});



