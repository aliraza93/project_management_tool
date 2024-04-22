$(document).ready(function () {
    // when click for get user data by identity address

    // AJAX request when the page is loaded
    $("#today_purchase").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#todays_purchase_area").attr("hidden", true);
        $("#purchase_info_search").attr("hidden", true);
        $("#prev_purchase_area").attr("hidden", true);

        $.ajax({
            url: "/admin/purchase-review/today-purchase",
            type: "GET",
            dataType: "json",
            success: function (response) {
                var productPurchase = response.productPurchase;
                var packagePurchase = response.packagePurchase;
                var paymentMethod = response.paymentMethod;

                var packageHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Package Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                packagePurchase.forEach(function (item) {
                    packageHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.quantity +
                        "</td>" +
                        "</tr>";
                });

                packageHTML += "</tbody></table>";

                var productHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Product Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                productPurchase.forEach(function (item) {
                    productHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.total_quantity +
                        "</td>" +
                        "</tr>";
                });

                productHTML += "</tbody></table>";

                var paymentMethodHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Payment Method</th>" +
                    "<th>Number of Transactions</th>" +
                    "<th>Amount</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                var totalAmount = 0;
                paymentMethod.forEach(function (item) {
                    var transaction_name;
                    if (item.payment_method == 1) transaction_name = "bKash";
                    else if (item.payment_method == 2)
                        transaction_name = "Nagad";
                    else if (item.payment_method == 3)
                        transaction_name = "Bank";
                    else if (item.payment_method == 4)
                        transaction_name = "Hand Cash";
                    paymentMethodHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        transaction_name +
                        "</td>" +
                        "<td>" +
                        item.transaction_numbers +
                        "</td>" +
                        "<td>" +
                        item.total_amount +
                        " Tk.</td>" +
                        "</tr>";

                    totalAmount += Number(item.total_amount);
                });

                paymentMethodHTML +=
                    '<tr role="row">' +
                    "<td colspan='2' align='right'><b>Total Amount:</b></td>" +
                    "<td><b>" +
                    totalAmount +
                    " Tk.</b></td>" +
                    "</tr>";
                paymentMethodHTML += "</tbody></table>";

                $("#todays_purchase_area").removeAttr("hidden");
                $("#existed_purchase_products_info").html(productHTML);
                $("#existed_purchase_package_info").html(packageHTML);
                $("#existed_purchase_payment_method").html(paymentMethodHTML);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });

    // AJAX request when the page is loaded
    $("#prev_purchase").on("click", function () {
        $(".dis-info-btn").removeClass("btn-primary");
        $(this).addClass("btn-primary");
        $("#todays_purchase_area").attr("hidden", true);
        $("#prev_purchase_area").attr("hidden", true);
        $("#purchase_info_search").attr("hidden", true);

        $.ajax({
            url: "/admin/purchase-review/prev-purchase",
            type: "GET",
            dataType: "json",
            success: function (response) {
                var productPurchase = response.productPurchase;
                var packagePurchase = response.packagePurchase;
                var paymentMethod = response.paymentMethod;

                var packageHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Package Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                packagePurchase.forEach(function (item) {
                    packageHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.quantity +
                        "</td>" +
                        "</tr>";
                });

                packageHTML += "</tbody></table>";

                var productHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Product Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                productPurchase.forEach(function (item) {
                    productHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.total_quantity +
                        "</td>" +
                        "</tr>";
                });

                productHTML += "</tbody></table>";

                var paymentMethodHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Payment Method</th>" +
                    "<th>Number of Transactions</th>" +
                    "<th>Amount</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                var totalAmount = 0;
                paymentMethod.forEach(function (item) {
                    var transaction_name;
                    if (item.payment_method == 1) transaction_name = "bKash";
                    else if (item.payment_method == 2)
                        transaction_name = "Nagad";
                    else if (item.payment_method == 3)
                        transaction_name = "Bank";
                    else if (item.payment_method == 4)
                        transaction_name = "Hand Cash";
                    paymentMethodHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        transaction_name +
                        "</td>" +
                        "<td>" +
                        item.transaction_numbers +
                        "</td>" +
                        "<td>" +
                        item.total_amount +
                        " Tk.</td>" +
                        "</tr>";

                    totalAmount += Number(item.total_amount);
                });

                paymentMethodHTML +=
                    '<tr role="row">' +
                    "<td colspan='2' align='right'><b>Total Amount:</b></td>" +
                    "<td><b>" +
                    totalAmount +
                    " Tk.</b></td>" +
                    "</tr>";
                paymentMethodHTML += "</tbody></table>";

                $("#prev_purchase_area").removeAttr("hidden");
                $("#purchase_info_search").removeAttr("hidden");
                $("#existed_prev_purchase_products_info").html(productHTML);
                $("#existed_prev_purchase_package_info").html(packageHTML);
                $("#existed_prev_payment_method").html(paymentMethodHTML);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });

    $("#purchase_info_search_btn").on("click", function () {
        var startDate = $("#start_date").val();
        var endDate = $("#end_date").val();

        $.ajax({
            url: "/admin/purchase-review/search-purchase",
            type: "GET",
            data: {
                start_date: startDate,
                end_date: endDate,
            },
            dataType: "json",
            success: function (response) {
                var productPurchase = response.productPurchase;
                var packagePurchase = response.packagePurchase;
                var paymentMethod = response.paymentMethod;

                var productHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Product Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                productPurchase.forEach(function (item) {
                    productHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.total_quantity +
                        "</td>" +
                        "</tr>";
                });

                productHTML += "</tbody></table>";

                var packageHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Package Name</th>" +
                    "<th>Quantity</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                packagePurchase.forEach(function (item) {
                    packageHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        item.title +
                        "</td>" +
                        "<td>" +
                        item.quantity +
                        "</td>" +
                        "</tr>";
                });

                packageHTML += "</tbody></table>";

                var paymentMethodHTML =
                    '<table class="display table table-striped table-bordered mb-0" id="example" role="grid" aria-describedby="basic-1_info">' +
                    "<thead>" +
                    '<tr role="row">' +
                    "<th>Payment Method</th>" +
                    "<th>Number of Transactions</th>" +
                    "<th>Amount</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>";

                var totalAmount = 0;
                paymentMethod.forEach(function (item) {
                    var transaction_name;
                    if (item.payment_method == 1) transaction_name = "bKash";
                    else if (item.payment_method == 2)
                        transaction_name = "Nagad";
                    else if (item.payment_method == 3)
                        transaction_name = "Bank";
                    else if (item.payment_method == 4)
                        transaction_name = "Hand Cash";
                    paymentMethodHTML +=
                        '<tr role="row">' +
                        "<td>" +
                        transaction_name +
                        "</td>" +
                        "<td>" +
                        item.transaction_numbers +
                        "</td>" +
                        "<td>" +
                        item.total_amount +
                        " Tk.</td>" +
                        "</tr>";

                    totalAmount += Number(item.total_amount);
                });

                paymentMethodHTML +=
                    '<tr role="row">' +
                    "<td colspan='2' align='right'><b>Total Amount:</b></td>" +
                    "<td><b>" +
                    totalAmount +
                    " Tk.</b></td>" +
                    "</tr>";
                paymentMethodHTML += "</tbody></table>";

                $("#existed_prev_purchase_products_info").html(productHTML);
                $("#existed_prev_purchase_package_info").html(packageHTML);
                $("#existed_prev_payment_method").html(paymentMethodHTML);
            },
            error: function (error) {
                // Handle errors here
                console.error("Error:", error);
            },
        });
    });
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
