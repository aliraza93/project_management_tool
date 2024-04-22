$(document).ready(function () {
    // when click for get user data by identity address
    $("#checkIdentityForUserIncome").on("click", function () {
        $("#existed_user_box").attr("hidden", true);
        $("#existed_business_info").attr("hidden", true);
        $("#dist_infos_btn").attr("hidden", true);
        $("#existed_bonus_info").attr("hidden", true);
        $("#bonus_info_search").attr("hidden", true);
        $("#existed_withdrawal_info").attr("hidden", true);
        $("#withdrawal_info_search").attr("hidden", true);
        $("#name").val("");
        $("#mobile_no").val("");
        $("#email").val("");
        $("#edit_dist_info_card").attr("hidden", true);
        $("#existed_identity_box").attr("hidden", true);
        var identityValue = $("#identity").val();

        if (validateIdentityField()) {
            $.ajax({
                url: `/admin/distributor-info/check-identity/${identityValue}`,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    var info = response.userAddress;
                    var matchingLevel = response.matchingLevel;
                    var isExistPaymentInfo = response.isBankInfoStatus;
                    $("#name").val(info.name);
                    $("#mobile_no").val(info.mobile_no);
                    $("#email").val(info.email);
                    var nids = response.nids;
                    var isFirstItem = true;

                    // Loop through each nid and concatenate it into the HTML string
                    var cardHtmlForIdentity =
                        '<div class="card-body">' +
                        '<h6 class="card-title mb-3">Link NID Information</h6>';

                    nids.forEach(function (nid, index) {
                        if (isFirstItem) {
                            cardHtmlForIdentity += '<p class="mb-1">';
                            cardHtmlForIdentity += nid; // Add nid
                            cardHtmlForIdentity +=
                                ' <span class="badge badge-secondary">Top ID</span>'; // Add the badge
                            cardHtmlForIdentity += "</p>";
                            isFirstItem = false;
                        } else {
                            cardHtmlForIdentity +=
                                '<p class="mb-1">' + nid + "</p>";
                        }
                    });

                    var cardHtml =
                        '<div class="card-body">' +
                        '<h6 class="card-title mb-3">User Information</h6>';
                    cardHtml +=
                        '<p class="mb-1">IBO ID: ' + info.identity + "</p>";
                    cardHtml +=
                        '<p class="mb-1">Name: ' +
                        info.name +
                        "</p>" +
                        '<p class="mb-1">Mobile No: ' +
                        info.mobile_no +
                        "</p>" +
                        '<p class="mb-1">Email: ' +
                        info.email +
                        "</p>" +
                        '<p class="mb-1">Address: ' +
                        info.address_line +
                        "</p>" +
                        '<p class="mb-1">Rank: ' +
                        matchingLevel +
                        "</p>" +
                        '<p class="mb-1">Sponsored By: ' +
                        info.sponsor_name +
                        ` (${info.sponsor_id})` +
                        "</p>" +
                        '<p class="mb-1">Joining Date: ' +
                        info.created_at +
                        "</p>" +
                        '<p class="mb-1">Package Title: ' +
                        info.title +
                        "</p>";

                    $("#existed_user_box").removeAttr("hidden");
                    $("#dist_infos_btn").removeAttr("hidden");
                    $("#existed_identity_box").removeAttr("hidden");

                    $("#existed_user_box").html(cardHtml);
                    $("#existed_identity_box").html(cardHtmlForIdentity);
                },
                error: function (error) {
                    console.error("Error:", error);
                    $(".identity-error").text(
                        "No user found for the provided identity."
                    );
                },
            });
        }
    });

    // AJAX request when the page is loaded
    $("#dist_business_info").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#existed_business_info").attr("hidden", true);
        $("#existed_bonus_info").attr("hidden", true);
        $("#bonus_info_search").attr("hidden", true);
        $("#existed_withdrawal_info").attr("hidden", true);
        $("#withdrawal_info_search").attr("hidden", true);
        $("#edit_dist_info_card").attr("hidden", true);

        $.ajax({
            url: "/admin/distributor-info/business-info",
            type: "GET",
            dataType: "json",
            success: function (response) {
                // Handle the response data here
                var countLeft = response.countLeft;
                var countRight = response.countRight;
                var totalSponsored = response.totalSponsored;
                var ranks = response.ranks;

                // Constructing the user information card HTML
                var cardHtml = '<div class="card-body">';

                // Loop through each user information object

                cardHtml +=
                    '<p class="mb-1">Total Downline: ' +
                    (countLeft + countRight) +
                    "</p>" +
                    '<p class="mb-1">Left: ' +
                    countLeft +
                    "</p>" +
                    '<p class="mb-1">Right: ' +
                    countRight +
                    "</p>" +
                    '<p class="mb-1">Total Sponsored: ' +
                    totalSponsored +
                    "</p>";

                // Include downline ranks
                cardHtml +=
                    '<p class="mb-1">Downline Rank Achiever:</p>' +
                    '<ul class="list-group " id="rank-list">' +
                    '<li class="list-group-item">Distributor: ' +
                    (ranks["distributor"] ? ranks["distributor"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Supervisor: ' +
                    (ranks["supervisor"] ? ranks["supervisor"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Assistant Manager: ' +
                    (ranks["assistant_manager"]
                        ? ranks["assistant_manager"]
                        : 0) +
                    "</li>" +
                    '<li class="list-group-item">Manager: ' +
                    (ranks["manager"] ? ranks["manager"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Senior Manager: ' +
                    (ranks["senior_manager"] ? ranks["senior_manager"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Emerald Manager: ' +
                    (ranks["emerald_manager"] ? ranks["emerald_manager"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Sapphire Manager: ' +
                    (ranks["Sapphire_Manager"]
                        ? ranks["Sapphire_Manager"]
                        : 0) +
                    "</li>" +
                    '<li class="list-group-item">Diamond Manager: ' +
                    (ranks["Diamond_Manager"] ? ranks["Diamond_Manager"] : 0) +
                    "</li>" +
                    '<li class="list-group-item">Netcore Manager: ' +
                    (ranks["Netcore_Manager"] ? ranks["Netcore_Manager"] : 0) +
                    "</li>" +
                    "</ul>";

                // Close the card body
                cardHtml += "</div>";

                $("#existed_business_info").removeAttr("hidden");
                $("#existed_business_info").html(cardHtml);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });

    // AJAX request when the page is loaded
    $("#dist_info_edit").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#existed_business_info").attr("hidden", true);
        $("#existed_bonus_info").attr("hidden", true);
        $("#bonus_info_search").attr("hidden", true);
        $("#existed_withdrawal_info").attr("hidden", true);
        $("#withdrawal_info_search").attr("hidden", true);

        $("#edit_dist_info_card").attr("hidden", false);
    });

    $("#dist_info_update_btn").click(function () {
        // Get the input field values
        var mobile_no = $("#mobile_no").val();
        var email = $("#email").val();
        var name = $("#name").val();
        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        // Create FormData to send data as multipart/form-data
        var formData = new FormData();
        formData.append("name", name);
        formData.append("mobile_no", mobile_no);
        formData.append("email", email);

        // AJAX request
        $.ajax({
            url: "/admin/update-distributor-info",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            success: function (response) {
                toastr.success(response.success, "Success");
            },
            error: function (xhr, status, error) {
                var response = xhr.responseJSON || {};

                // Display error messages
                var errorMessage = response.errors
                    ? Object.values(response.errors).flat().join("<br>")
                    : response.message || "Something went wrong.";

                // Show error message
                toastr.error(errorMessage, "Error");
            },
        });
    });

    // AJAX request when the page is loaded
    $("#dist_bonus_info").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#existed_business_info").attr("hidden", true);
        $("#existed_bonus_info").attr("hidden", true);
        $("#bonus_info_search").attr("hidden", true);
        $("#existed_withdrawal_info").attr("hidden", true);
        $("#withdrawal_info_search").attr("hidden", true);
        $("#edit_dist_info_card").attr("hidden", true);

        $.ajax({
            url: "/admin/distributor-info/bonus-info",
            type: "GET",
            dataType: "json",
            success: function (response) {
                var tax = response.tax;
                var referralBonusBv = response.referralBonusBv;
                var matchingBonusBv = response.matchingBonusBv;
                var generationBonusBv = response.generationBonusBv;
                var purchaseCashbackBV = response.purchaseCashbackBV;
                var result =
                    parseFloat(generationBonusBv) +
                    parseFloat(matchingBonusBv) +
                    parseFloat(purchaseCashbackBV) +
                    parseFloat(referralBonusBv);

                // Convert the result to a string with 4 decimal places
                var formattedResult = result.toFixed(4);
                var netBv = formattedResult - tax;
                var tableHtml =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Referral Bonus</th>" +
                    "<th>Matching Bonus</th>" +
                    "<th>Generation Bonus</th>" +
                    "<th>Leadership Bonus</th>" +
                    "<th>Repurchase Bonus</th>" +
                    "<th>Total Bonus</th>" +
                    "<th>Tax(10%)</th>" +
                    "<th>Net Income(BV)</th>" +
                    "<th>Net Income(TK)</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    '<tr role="row" class="odd">' +
                    "<td>" +
                    formatBVWithCommas(referralBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(matchingBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(generationBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>0.000 BV</td>" + // Assuming this is a fixed value
                    "<td>" +
                    formatBVWithCommas(purchaseCashbackBV) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(
                        generationBonusBv +
                            matchingBonusBv +
                            purchaseCashbackBV +
                            referralBonusBv
                    ) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(tax) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(netBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatTakaWithCommas(netBv * 125) +
                    " " +
                    "TK" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>";

                // Insert the table HTML into the specified div
                $("#existed_bonus_info").removeAttr("hidden");
                $("#bonus_info_search").removeAttr("hidden");
                $("#existed_bonus_info").html(tableHtml);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });

    $("#bonus_info_search_btn").on("click", function () {
        $("#existed_bonus_info").attr("hidden", true);
        var startDate = $("#start_date").val();
        var endDate = $("#end_date").val();

        // AJAX request
        $.ajax({
            url: "/admin/distributor-info/search-bonus-info",
            type: "GET",
            data: {
                start_date: startDate,
                end_date: endDate,
            },
            dataType: "json",
            success: function (response) {
                var tax = response.tax;
                var referralBonusBv = response.referralBonusBv;
                var matchingBonusBv = response.matchingBonusBv;
                var generationBonusBv = response.generationBonusBv;
                var purchaseCashbackBV = response.purchaseCashbackBV;
                var tableHtml =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Referral Bonus</th>" +
                    "<th>Matching Bonus</th>" +
                    "<th>Generation Bonus</th>" +
                    "<th>Leadership Bonus</th>" +
                    "<th>Repurchase Bonus</th>" +
                    "<th>Total Bonus</th>" +
                    "<th>Tax</th>" +
                    "<th>Net Income</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    '<tr role="row" class="odd">' +
                    "<td>" +
                    formatBVWithCommas(referralBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(matchingBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(generationBonusBv) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>0.000 BV</td>" + // Assuming this is a fixed value
                    "<td>" +
                    formatBVWithCommas(purchaseCashbackBV) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(
                        generationBonusBv +
                            matchingBonusBv +
                            purchaseCashbackBV +
                            referralBonusBv
                    ) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatBVWithCommas(tax) +
                    " " +
                    "BV" +
                    "</td>" +
                    "<td>" +
                    formatTakaWithCommas(
                        generationBonusBv +
                            matchingBonusBv +
                            purchaseCashbackBV +
                            referralBonusBv * 125
                    ) +
                    " " +
                    "TK" +
                    "</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>";

                // Insert the table HTML into the specified div
                $("#existed_bonus_info").removeAttr("hidden");
                $("#existed_bonus_info").html(tableHtml);
            },
            error: function (xhr, status, error) {
                // Handle error
                console.error(xhr.responseText);
            },
        });
    });

    // AJAX request when the page is loaded
    $("#dist_withdrawal_info").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#existed_business_info").attr("hidden", true);
        $("#existed_bonus_info").attr("hidden", true);
        $("#existed_withdrawal_info").attr("hidden", true);
        $("#bonus_info_search").attr("hidden", true);
        $("#withdrawal_info_search").attr("hidden", true);
        $("#edit_dist_info_card").attr("hidden", true);

        $.ajax({
            url: "/admin/distributor-info/withdrawal-info",
            type: "GET",
            dataType: "json",
            success: function (response) {
                var withdrawInfo = response.withdrawInfo;

                var tableHtml =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Date</th>" +
                    "<th>BV</th>" +
                    "<th>TK</th>" +
                    "<th>Medium</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                // Iterate over each withdrawInfo item and construct table rows
                withdrawInfo.forEach(function (item) {
                    var date = item.created_at;
                    var withdraw_bv = item.withdraw_bv;
                    var withdraw_tk = item.withdraw_tk;

                    var media_type = "";

                    // Determine the text for media_type based on its value
                    switch (item.media_type) {
                        case 1:
                            media_type = "Bank";
                            break;
                        case 2:
                            media_type = "bKash";
                            break;
                        case 3:
                            media_type = "Nagad";
                            break;
                        default:
                            media_type = "Unknown";
                    }

                    // Construct table row HTML
                    tableHtml +=
                        '<tr role="row" class="odd">' +
                        "<td>" +
                        date +
                        "</td>" +
                        "<td>" +
                        formatBVWithCommas(withdraw_bv) +
                        " BV" +
                        "</td>" +
                        "<td>" +
                        formatTakaWithCommas(withdraw_tk) +
                        " TK" +
                        "</td>" +
                        "<td>" +
                        media_type +
                        "</td>" +
                        "</tr>";
                });

                // Close the table body and table HTML
                tableHtml += "</tbody></table>";
                // Insert the table HTML into the specified div
                $("#existed_withdrawal_info").removeAttr("hidden");
                $("#withdrawal_info_search").removeAttr("hidden");
                $("#existed_withdrawal_info").html(tableHtml);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });

    // AJAX request when the page is loaded
    $("#withdrawal_info_search_btn").on("click", function () {
        $("#existed_withdrawal_info").attr("hidden", true);
        var startDate = $("#withdrawal_start_date").val();
        var endDate = $("#withdrawal_end_date").val();

        $.ajax({
            url: "/admin/distributor-info/search-withdrawal-info",
            type: "GET",
            data: {
                start_date: startDate,
                end_date: endDate,
            },
            dataType: "json",
            success: function (response) {
                var withdrawInfo = response.withdrawInfo;

                var tableHtml =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Date</th>" +
                    "<th>BV</th>" +
                    "<th>TK</th>" +
                    "<th>Medium</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                // Iterate over each withdrawInfo item and construct table rows
                withdrawInfo.forEach(function (item) {
                    var date = item.created_at;
                    var withdraw_bv = item.withdraw_bv;
                    var withdraw_tk = item.withdraw_tk;

                    var media_type = "";

                    // Determine the text for media_type based on its value
                    switch (item.media_type) {
                        case 1:
                            media_type = "Bank";
                            break;
                        case 2:
                            media_type = "bKash";
                            break;
                        case 3:
                            media_type = "Nagad";
                            break;
                        default:
                            media_type = "Unknown";
                    }

                    // Construct table row HTML
                    tableHtml +=
                        '<tr role="row" class="odd">' +
                        "<td>" +
                        date +
                        "</td>" +
                        "<td>" +
                        formatBVWithCommas(withdraw_bv) +
                        " BV" +
                        "</td>" +
                        "<td>" +
                        formatTakaWithCommas(withdraw_tk) +
                        " TK" +
                        "</td>" +
                        "<td>" +
                        media_type +
                        "</td>" +
                        "</tr>";
                });

                // Close the table body and table HTML
                tableHtml += "</tbody></table>";
                // Insert the table HTML into the specified div
                $("#existed_withdrawal_info").removeAttr("hidden");
                $("#withdrawal_info_search").removeAttr("hidden");
                $("#existed_withdrawal_info").html(tableHtml);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });
});

function validateIdentityField() {
    // Reset error messages and styles
    $(".error-message").text("");
    $("input, select").removeClass("error");

    // Get the value of the identity field
    var identityValue = $("#identity").val();

    // Validate the identity field using jQuery
    if (isNaN(identityValue)) {
        $(".identity-error").text("Please enter a valid numeric identity.");
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");

        return false;
    } else if (identityValue.length < 9) {
        $(".identity-error").text(
            "Identity length should be at least 9 characters."
        );
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");

        return false;
    } else if (identityValue.length > 14) {
        $(".identity-error").text(
            "Identity length should not exceed 14 characters."
        );
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");

        return false;
    }

    // Add red border color to the input field
    if ($("#identity").hasClass("error")) {
        $("#identity").css("border-color", "red");
        return false;
    } else {
        $("#identity").css("border-color", "");
        return true;
    }
}

$("body").on("input", "#identity", function () {
    var identityValue = $(this).val();

    // Reset previous error messages and styling
    $("#identity-error").text("");
    $("#identity").css("border-color", "");

    // Validate the identity field using jQuery
    if (isNaN(identityValue)) {
        $(".identity-error").text("Please enter a valid numeric identity.");
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");
    } else if (identityValue.length < 9) {
        $(".identity-error").text(
            "Identity length should be at least 9 characters."
        );
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");
    } else if (identityValue.length > 14) {
        $(".identity-error").text(
            "Identity length should not exceed 14 characters."
        );
        $("#identity").addClass("error");
        $("#identity").css("border-color", "red");
    } else {
        $(".identity-error").text("");
        $("#identity").removeClass("error");
        $("#identity").css("border-color", "");
    }
});

function formatBVWithCommas(number) {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    });

    const formattedNumber = formatter.format(number);

    return formattedNumber;
}

function formatTakaWithCommas(number) {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);

    return formattedNumber;
}
