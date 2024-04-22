$(document).ready(function () {
    // Set up the datepicker
    $("#datepicker").datepicker();

    // Set up the AJAX request on button click
    $("#payoutListSearch").on("click", function () {
        $("#existed_user_box").attr("hidden", true);
        var searchDate = $("#datepicker").datepicker("getDate");
        if (!searchDate) {
            alert("Please select date");
            return;
        }

        // Format the date using Moment.js
        var formattedDate = moment(searchDate).format("YYYY-MM-DD HH:mm:ss");

        console.log("searchDate", searchDate);
        console.log("formattedDate", formattedDate);

        // Make an AJAX request
        $.ajax({
            url: "/admin/search-payout-list",
            type: "GET",
            data: {
                payout_date: formattedDate,
            },
            success: function (data) {
                var cardHtml =
                    '<div class="card-body">' +
                    "<div>" +
                    '<h6 class="card-title mb-3">Payout Download Center</h6>';

                if (data.csv_path_bank) {
                    cardHtml +=
                        '<p class="mb-1 d-flex justify-content-between border-bottom pb-2">Download payout for Bank: <a href="#" class="download-link" data-csv-path="' +
                        data.csv_path_bank +
                        '" data-file-name="Bank_CSV">Download File</a></p>';
                }

                if (data.csv_path_bkash) {
                    cardHtml +=
                        '<p class="mb-1 d-flex justify-content-between border-bottom pb-2">Download payout for bKash: <a href="#" class="download-link" data-csv-path="' +
                        data.csv_path_bkash +
                        '" data-file-name="bKash_CSV">Download File</a></p>';
                }

                if (data.csv_path_nagad) {
                    cardHtml +=
                        '<p class="mb-1 d-flex justify-content-between border-bottom pb-2">Download payout for Nagad: <a href="#" class="download-link" data-csv-path="' +
                        data.csv_path_nagad +
                        '" data-file-name="Nagad_CSV">Download File</a></p>';
                }

                if (
                    !data.csv_path_bank &&
                    !data.csv_path_bkash &&
                    !data.csv_path_nagad
                ) {
                    // Handle the case when all CSV paths are empty
                    cardHtml +=
                        '<p class="mb-1">No Payout files available.</p>';
                }

                cardHtml += "</div>";

                $("#existed_user_box").removeAttr("hidden");
                $("#existed_user_box").html(cardHtml);
            },

            error: function (error) {
                console.log(error);
            },
        });
    });
});

// Add a delegated click event for the download links
$(document).on("click", ".download-link", function () {
    var csvPathName = $(this).data("csv-path"); // Get the filename from data attribute
    console.log("csvFileName", csvPathName);

    // Remove the prefix from the filename
    var filename = csvPathName.split("/storage/app/csv/")[1];

    // Hit the route with the filename
    var downloadUrl = "/admin/payout/download-csv/" + filename;
    console.log("downloadUrl", downloadUrl);
    window.open(downloadUrl, "_blank");
});
