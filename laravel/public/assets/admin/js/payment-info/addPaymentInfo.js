$(document).ready(function () {
    var activeTab = "bank-tab";
    $("#nagad-tab").on("click", function () {
        activeTab = "nagad-tab";
        $("#media_type").val(3);
    });

    $("#bkash-tab").on("click", function () {
        activeTab = "bkash-tab";
        $("#media_type").val(2);
    });

    // If you intended to have a separate click handler for "bank-tab"
    $("#bank-tab").on("click", function () {
        activeTab = "bank-tab";
        $("#media_type").val(1);
    });

    $("#myTab a").on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    $("#bank_name").on("change", function () {
        // Get the selected option's ID
        var selectedId = $(this).val();
        console.log("selectedId", selectedId);

        // Update the value attribute of the select element
        $(this).attr("value", selectedId);
    });

    $("#payment_info_submit").click(function () {
        if (activeTab == "bank-tab") {
            if (validateBankForm()) {
                savePaymentInfo();
            }
        } else if (activeTab == "bkash-tab") {
            if (validateBkashForm()) {
                savePaymentInfo();
            }
        } else {
            if (validateNagadForm()) {
                savePaymentInfo();
            }
        }
    });

    // Call getBank function when the page is ready
    getBank();

    function savePaymentInfo() {
        console.log("hello");
        var bank_name = $("#bank_name").val();
        var bank_branch_name = $("#bank_branch_name").val();
        var bank_account_number = $("#bank_account_number").val();
        var bank_branch_routing_number = $("#bank_branch_routing_number").val();
        var bank_account_mobile_number = $("#bank_account_mobile_number").val();
        var bkash_mobile_number = $("#bkash_mobile_number").val();
        var netmark_registered_number = $("#netmark_registered_number").val();
        var nagad_mobile_number = $("#nagad_mobile_number").val();
        var bank_account_name = $("#bank_account_name").val();
        var netmark_registered_number = $("#netmark_registered_number").val();
        var media_type = $("#media_type").val();
        var identity = $("#identity").val();

        var formData = new FormData();
        formData.append("bank_name", bank_name);
        formData.append("bank_branch_name", bank_branch_name);
        formData.append("bank_account_name", bank_account_name);
        formData.append("netmark_registered_number", netmark_registered_number);
        formData.append("bank_account_number", bank_account_number);
        formData.append(
            "bank_account_mobile_number",
            bank_account_mobile_number
        );
        formData.append(
            "bank_branch_routing_number",
            bank_branch_routing_number
        );
        formData.append("bkash_mobile_number", bkash_mobile_number);
        formData.append("nagad_mobile_number", nagad_mobile_number);
        formData.append("media_type", media_type);
        formData.append("identity", identity);
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        // AJAX request
        $.ajax({
            url: "/admin/payment-info-store",
            type: "POST",
            data: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
            processData: false,
            contentType: false,
            success: function (response) {
                toastr.success(response.message);
            },
            error: function (xhr, status, error) {
                var response = xhr.responseJSON;
                toastr.error(response.message);
            },
        });
    }

    // get banks ajax
    function getBank() {
        $.ajax({
            url: "/api/get-bank",
            method: "GET",
            dataType: "json",
            success: function (data) {
                var banks = data.banks;
                var dropdown = $("#bank_name");

                $.each(banks, function (_, banks) {
                    var id = banks.id;
                    var name = banks.name;

                    if (!$(`#bank_name option[value="${id}"]`).length) {
                        dropdown.append(new Option(name, id));
                    }
                });
                // Add default "Select a Division" option
                if ($("#bank_name option[value='']").length === 0) {
                    dropdown.prepend(new Option("Select bank name", "", true));
                    $("#bank_name option:first").attr("disabled", "disabled");
                }
            },
            error: function (error) {
                console.error("Error fetching bank:", error);
            },
        });
    }

    function validateBankForm() {
        var bank_name = $("#bank_name").val();
        var bank_branch_name = $("#bank_branch_name").val();
        var bank_account_number = $("#bank_account_number").val();
        var bank_branch_routing_number = $("#bank_branch_routing_number").val();
        var bank_account_mobile_number = $("#bank_account_mobile_number").val();
        var bank_account_name = $("#bank_account_name").val();
        var netmark_registered_number = $("#netmark_registered_number").val();

        // Reset error messages and border colors
        $(
            "error-bank-name",
            "#error-bank-account-number",
            "#error-bank-branch-name",
            "#error-bank-branch-routing-number",
            "#error-bank-account-mobile-number",
            "error-bank-account-name",
            "error-netmark-registered-number"
        ).text("");

        if (!bank_account_mobile_number) {
            $("#error-bank-account-mobile-number").text(
                "Mobile number is required."
            );
        } else if (!/^\d+$/.test(bank_account_mobile_number)) {
            $("#error-bank-account-mobile-number").text(
                "Please enter only numeric characters for mobile number."
            );
        } else if (bank_account_mobile_number.length < 10) {
            $("#error-bank-account-mobile-number").text(
                "Mobile number should be at least 10 digits."
            );
        } else if (bank_account_mobile_number.length > 13) {
            $("#error-bank-account-mobile-number").text(
                "Mobile number should not exceed 13 digits."
            );
        }

        if (!bank_name) {
            $("#error-bank-name").text("Bank name is required.");
        }

        if (!bank_branch_name) {
            $("#error-bank-branch-name").text("Bank branch name is required.");
        }

        if (!bank_account_name) {
            $("#error-bank-account-name").text(
                "Bank account name is required."
            );
        }

        if (!netmark_registered_number) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number is required."
            );
        } else if (netmark_registered_number.length > 20) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number should not exceed 20 digits."
            );
        } else if (!/^\d+$/.test(netmark_registered_number)) {
            // Check if the input contains only numbers
            $("#error-netmark-registered-number").text(
                "Please enter only numeric characters."
            );
        }
        if (!bank_account_number) {
            $("#error-bank-account-number").text(
                "Bank account number is required."
            );
        } else if (!/^\d+$/.test(bank_account_number)) {
            // Check if the bank_account_number contains only numbers
            $("#error-bank-account-number").text(
                "Please enter only numeric characters for bank account number."
            );
        } else if (bank_account_number.length > 20) {
            // Check if the bank_account_number has a length greater than 20
            $("#error-bank-account-number").text(
                "Bank account number should not exceed 20 digits."
            );
        }

        if (!bank_branch_routing_number) {
            $("#error-bank-branch-routing-number").text(
                "Bank branch routing number is required."
            );
        } else if (!/^\d+$/.test(bank_branch_routing_number)) {
            // Check if the bank_branch_routing_number contains only numbers
            $("#error-bank-branch-routing-number").text(
                "Please enter only numeric characters for bank branch routing number."
            );
        } else if (bank_branch_routing_number.length !== 9) {
            // Check if the bank_branch_routing_number has a length greater than 20
            $("#error-bank-branch-routing-number").text(
                "Bank branch routing number should be 9 digits."
            );
        }

        // Check if there are any errors
        if (
            $("#error-bank-name").text() ||
            $("#error-bank-account-number").text() ||
            $("#error-bank-branch-name").text() ||
            $("#error-bank-branch-routing-number").text() ||
            $("#error-bank-account-mobile-number").text() ||
            $("#error-bank-account-name").text() ||
            $("#error-netmark-registered-number").text()
        ) {
            return false;
        }

        return true;
    }

    function validateBkashForm() {
        var bkash_mobile_number = $("#bkash_mobile_number").val();
        var netmark_registered_number = $("#netmark_registered_number").val();

        // Reset error messages and border colors
        $(
            "#error-bkash-mobile-number",
            "#error-netmark-registered-number"
        ).text("");

        if (!bkash_mobile_number) {
            $("#error-bkash-mobile-number").text("Mobile number is required.");
        } else {
            $("#error-bkash-mobile-number").text("");

            if (!/^\d+$/.test(bkash_mobile_number)) {
                // Check if the bkash_mobile_number contains only numbers
                $("#error-bkash-mobile-number").text(
                    "Please enter only numeric characters for mobile number."
                );
            }

            if (bkash_mobile_number.length < 10) {
                // Check if the bkash_mobile_number has a length less than 10
                $("#error-bkash-mobile-number").text(
                    "Mobile number should be at least 10 digits."
                );
            }

            if (bkash_mobile_number.length > 13) {
                // Check if the bkash_mobile_number has a length greater than 13
                $("#error-bkash-mobile-number").text(
                    "Mobile number should not exceed 13 digits."
                );
            }
        }

        if (!netmark_registered_number) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number is required."
            );
        } else if (netmark_registered_number.length > 20) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number should not exceed 20 digits."
            );
        } else if (!/^\d+$/.test(netmark_registered_number)) {
            // Check if the input contains only numbers
            $("#error-netmark-registered-number").text(
                "Please enter only numeric characters."
            );
        }
        // Check if there are any errors
        if (
            $("#error-bkash-mobile-number").text() ||
            $("#error-netmark-registered-number").text()
        ) {
            return false;
        }

        return true;
    }

    function validateNagadForm() {
        var nagad_mobile_number = $("#nagad_mobile_number").val();
        var netmark_registered_number = $("#netmark_registered_number").val();

        // Reset error messages and border colors
        $("#error-nagad-mfs-number", "#error-netmark-registered-number").text(
            ""
        );

        if (!nagad_mobile_number) {
            $("#error-nagad-mobile-number").text("Mobile number is required.");
        } else {
            $("#error-nagad-mobile-number").text("");

            if (!/^\d+$/.test(nagad_mobile_number)) {
                // Check if the nagad_mobile_number contains only numbers
                $("#error-nagad-mobile-number").text(
                    "Please enter only numeric characters for mobile number."
                );
            }

            if (nagad_mobile_number.length < 10) {
                // Check if the nagad_mobile_number has a length less than 10
                $("#error-nagad-mobile-number").text(
                    "Mobile number should be at least 10 digits."
                );
            }

            if (nagad_mobile_number.length > 13) {
                // Check if the nagad_mobile_number has a length greater than 13
                $("#error-nagad-mobile-number").text(
                    "Mobile number should not exceed 13 digits."
                );
            }
        }
        if (!netmark_registered_number) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number is required."
            );
        } else if (netmark_registered_number.length > 20) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number should not exceed 20 digits."
            );
        } else if (!/^\d+$/.test(netmark_registered_number)) {
            // Check if the input contains only numbers
            $("#error-netmark-registered-number").text(
                "Please enter only numeric characters."
            );
        }
        // Check if there are any errors
        if (
            $("#error-nagad-mfs-number").text() ||
            $("#error-netmark-registered-number").text()
        ) {
            return false;
        }

        return true;
    }

    // bank_account_mobile_number error handling
    $("body").on("input", "#bank_account_mobile_number", function () {
        var bank_account_mobile_number = $(this).val();

        if (!bank_account_mobile_number) {
            $("#error-bank-account-mobile-number").text(
                "Mobile number is required."
            );
            $("#bank_account_mobile_number").css("border-color", "red");
        } else if (!/^\d+$/.test(bank_account_mobile_number)) {
            // Check if the bank_account_mobile_number contains only numbers
            $("#error-bank-account-mobile-number").text(
                "Please enter only numeric characters for mobile number."
            );
            $("#bank_account_mobile_number").css("border-color", "red");
        } else if (bank_account_mobile_number.length < 10) {
            // Check if the bank_account_mobile_number has a length less than 10
            $("#error-bank-account-mobile-number").text(
                "Mobile number should be at least 10 digits."
            );
            $("#bank_account_mobile_number").css("border-color", "red");
        } else if (bank_account_mobile_number.length > 13) {
            // Check if the bank_account_mobile_number has a length greater than 13
            $("#error-bank-account-mobile-number").text(
                "Mobile number should not exceed 13 digits."
            );
            $("#bank_account_mobile_number").css("border-color", "red");
        } else {
            // Clear the error message if none of the conditions are met
            $("#error-bank-account-mobile-number").text("");
            $("#bank_account_mobile_number").css("border-color", "");
        }

        if (bank_account_mobile_number) {
            $(this).val(bank_account_mobile_number);
        } else {
            $(this).val("");
        }
    });

    // bank name error handeling
    $("body").on("input", "#bank_name", function () {
        var bank_name = $(this).val();

        if (!bank_name) {
            $("#error-bank-name").text("Bank name is required.");
            $("#bank_name").css("border-color", "red");
        } else {
            $("#error-bank-name").text("");
            $("#bank_name").css("border-color", "");
        }

        if (bank_name) {
            $(this).val(bank_name);
        } else {
            $(this).val("");
        }
    });

    $("body").on("input", "#bank_account_number", function () {
        var bank_account_number = $(this).val();

        if (!bank_account_number) {
            $("#error-bank-account-number").text(
                "Bank account number is required."
            );
            $("#bank_account_number").css("border-color", "red");
        } else if (!/^\d+$/.test(bank_account_number)) {
            // Check if the input contains only numbers
            $("#error-bank-account-number").text(
                "Please enter a valid numeric account number."
            );
            $("#bank_account_number").css("border-color", "red");
        } else {
            $("#error-bank-account-number").text("");
            $("#bank_account_number").css("border-color", "");
        }
    });

    $("body").on("input", "#bank_account_name", function () {
        var bank_account_name = $(this).val();

        if (!bank_account_name) {
            $("#error-bank-account-name").text(
                "Bank account name is required."
            );
            $("#bank_account_name").css("border-color", "red");
        } else {
            $("#error-bank-account-name").text("");
            $("#bank_account_name").css("border-color", "");
        }
    });

    // bank branch name error handeling
    $("body").on("input", "#bank_branch_name", function () {
        var bank_branch_name = $(this).val();

        if (!bank_branch_name) {
            $("#error-bank-branch-name").text("Bank branch name is required.");
            $("#bank_branch_name").css("border-color", "red");
        } else {
            $("#error-bank-branch-name").text("");
            $("#bank_branch_name").css("border-color", "");
        }

        if (bank_branch_name) {
            $(this).val(bank_branch_name);
        } else {
            $(this).val("");
        }
    });

    $("body").on("input", "#bank_branch_routing_number", function () {
        var bank_branch_routing_number = $(this).val();

        if (!bank_branch_routing_number) {
            $("#error-bank-branch-routing-number").text(
                "Bank branch routing number is required."
            );
            $("#bank_branch_routing_number").css("border-color", "red");
        } else if (!/^\d+$/.test(bank_branch_routing_number)) {
            // Check if the input contains only numbers
            $("#error-bank-branch-routing-number").text(
                "Please enter a valid numeric routing number."
            );
            $("#bank_branch_routing_number").css("border-color", "red");
        } else {
            $("#error-bank-branch-routing-number").text("");
            $("#bank_branch_routing_number").css("border-color", "");
        }
    });

    $("body").on("input", "#bkash_mobile_number", function () {
        var bkash_mobile_number = $(this).val();

        // Reset previous error messages and styling
        $("#error-bkash-mobile-number").text("");
        $("#bkash_mobile_number").css("border-color", "");

        if (!bkash_mobile_number) {
            $("#error-bkash-mobile-number").text(
                "Bkash mobile number is required."
            );
            $("#bkash_mobile_number").css("border-color", "red");
        } else {
            $("#error-bkash-mobile-number").text("");
            $("#bkash_mobile_number").css("border-color", "");

            if (!/^\d+$/.test(bkash_mobile_number)) {
                // Check if the input contains only numbers
                $("#error-bkash-mobile-number").text(
                    "Please enter only numeric characters."
                );
                $("#bkash_mobile_number").css("border-color", "red");
            } else if (bkash_mobile_number.length < 10) {
                // Check if the input has a length less than 10
                $("#error-bkash-mobile-number").text(
                    "Please enter at least 10 digits."
                );
                $("#bkash_mobile_number").css("border-color", "red");
            } else if (bkash_mobile_number.length > 13) {
                // Check if the input has a length greater than 13
                $("#error-bkash-mobile-number").text(
                    "Please enter at most 13 digits."
                );
                $("#bkash_mobile_number").css("border-color", "red");
            }
        }
    });

    $("body").on("input", "#nagad_mobile_number", function () {
        var nagad_mobile_number = $(this).val();

        // Reset previous error messages and styling
        $("#error-nagad-mobile-number").text("");
        $("#nagad_mobile_number").css("border-color", "");

        if (!nagad_mobile_number) {
            $("#error-nagad-mobile-number").text(
                "Nagad mobile number is required."
            );
            $("#nagad_mobile_number").css("border-color", "red");
        } else if (!/^\d+$/.test(nagad_mobile_number)) {
            // Check if the input contains only numbers
            $("#error-nagad-mobile-number").text(
                "Please enter only numeric characters."
            );
            $("#nagad_mobile_number").css("border-color", "red");
        } else if (nagad_mobile_number.length < 10) {
            // Check if the input has a length less than 10
            $("#error-nagad-mobile-number").text(
                "Please enter at least 10 digits."
            );
            $("#nagad_mobile_number").css("border-color", "red");
        } else if (nagad_mobile_number.length > 13) {
            // Check if the input has a length greater than 13
            $("#error-nagad-mobile-number").text(
                "Please enter at most 13 digits."
            );
            $("#nagad_mobile_number").css("border-color", "red");
        }
    });

    $("body").on("input", "#netmark_registered_number", function () {
        var netmark_registered_number = $(this).val();

        // Reset previous error messages and styling
        $("#error-netmark-registered-number").text("");
        $("#netmark_registered_number").css("border-color", "");

        if (!netmark_registered_number) {
            $("#error-netmark-registered-number").text(
                "Netmark registered number is required."
            );
            $("#netmark_registered_number").css("border-color", "red");
        } else if (!/^\d+$/.test(netmark_registered_number)) {
            // Check if the input contains only numbers
            $("#error-netmark-registered-number").text(
                "Please enter only numeric characters."
            );
            $("#netmark_registered_number").css("border-color", "red");
        } else if (netmark_registered_number.length > 20) {
            // Check if the input has a length less than 10
            $("#error-netmark-registered-number").text(
                "Netmark registered number should not exceed 20 digits."
            );
            $("#netmark_registered_number").css("border-color", "red");
        }
    });
});
