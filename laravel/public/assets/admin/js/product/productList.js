$(document).ready(function () {
    // approve or disapprove specific product showing
    $(".specific-product-show-switch").change(function () {
        console.log("hello");
        var switchValue = $(this).prop("checked") ? 1 : 0;
        var productid = $(this)
            .closest(".show-hide-product-form")
            .data("product-id");

        $.ajax({
            type: "POST",
            url: "/product-show/" + productid,
            data: {
                _method: "POST",
                is_showing: switchValue,
            },
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                toastr.success(response.message);
            },
            error: function (error) {
                toastr.error("An error occurred.");
            },
        });
    });
});
