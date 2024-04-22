$(document).ready(function () {
    var selectedAddressId;
    var userType = $("#userType").data("user-type");
    var isExistShippingInfo = $("#isExistShippingInfo").val();
    var isClickNewAddress = false;
    var totalPriceTakaString = $("#total_price").text();
    $("#shipping_bv").text(`${formatTakaWithCommas(110) + " " + "Tk"}`);

    var totalPriceTaka = parseFloat(totalPriceTakaString.replace(/[Tk,]/g, ""));

    // Add 110 to totalPriceTaka
    var newTotalPrice = totalPriceTaka + 110;

    // Update the content of the span with the new value
    $("#total_price").text(formatTakaWithCommas(newTotalPrice) + " " + "Tk");
    $("#checkout-submit").prop("disabled", true);
    $("#pickup_location_area").hide();

    if (
        $("#insertNewAddress").is(":visible") ||
        $("#useExistingAddress").is(":visible")
    ) {
        $("#checkout-submit").prop("disabled", true);
    }
    // fetch upazilas data
    $("#district").on("change", function () {
        const selectedDistrictId = $(this).val();

        $.ajax({
            url: `/api/get-upazila/${selectedDistrictId}`,
            method: "GET",
            success: function (data) {
                const upazilas = data.upazilas;
                const dropdown = $("#upazila");

                dropdown.empty();

                dropdown.append(new Option("Select a upazila", ""));

                $.each(upazilas, function (index, upazila) {
                    dropdown.append(new Option(upazila.name, upazila.id));
                });

                if (!isClickNewAddress) {
                    validateForm();
                }
            },
            error: function (error) {
                console.error("Error fetching upazilas:", error);
            },
        });
    });

    // fetch district data
    $("#division").on("change", function () {
        const selectedDivisionId = $(this).val();

        $.ajax({
            url: `/api/get-districts/${selectedDivisionId}`,
            method: "GET",
            success: function (data) {
                const districts = data.districts;
                const districDropdown = $("#district");
                const upazilaDropdown = $("#upazila");

                upazilaDropdown.empty();
                upazilaDropdown.append(new Option("Select a upazila", ""));

                districDropdown.empty();
                districDropdown.append(new Option("Select a district", ""));

                $.each(districts, function (index, district) {
                    districDropdown.append(
                        new Option(district.name, district.id)
                    );
                });
                if (!isClickNewAddress) {
                    validateForm();
                }
            },
            error: function (error) {
                console.error("Error fetching districts:", error);
            },
        });
    });

    // fetch divisions data

    $.ajax({
        url: "/api/get-divisions",
        method: "GET",
        dataType: "json",
        success: function (data) {
            var divisions = data.divisions;
            var dropdown = $("#division");

            if (isClickNewAddress) {
                $.each(divisions, function (id, name) {
                    if (!$(`#division option[value="${id}"]`).length) {
                        dropdown.append(new Option(name, id));
                    }
                });

                // Add default "Select a Division" option
                dropdown.prepend(
                    new Option("Select a division", "", true, true)
                );
                $("#division option:first").attr("disabled", "disabled");
            } else {
                $.each(divisions, function (id, name) {
                    if (!$(`#division option[value="${id}"]`).length) {
                        dropdown.append(new Option(name, id));
                    }
                });
            }
        },
        error: function (error) {
            console.error("Error fetching divisions:", error);
        },
    });

    // Attach the change event to all input fields
    $("input, select").on("input", function () {
        if (!isClickNewAddress) {
            validateForm();
        }
    });

    if (userType == "admin" || userType == "accountant") {
        $(".delivery-option-area").hide();
    } else {
        $("#newAddressForm").attr("hidden", true);
        if (isExistShippingInfo == 0) {
            $("#newAddressForm").removeAttr("hidden");
            $("#delivery-option-areas").removeAttr("hidden");
        }
    }

    // when click for existing address

    $("#existingAddressActions").on("click", function () {
        $("#addressActions").hide();
        $("#delivery-option-areas").removeAttr("hidden");
        $.ajax({
            url: "/checkout/check-shipping-address",
            type: "GET",
            dataType: "json",
            success: function (response) {
                var shippingAddresses = response.allShippingAddress;
                $("#shippingAddressesTable").removeAttr("hidden");
                $("#shippingAddressesTable tbody").empty();

                $.each(shippingAddresses, function (index, address) {
                    var buttonText =
                        address.id === selectedAddressId
                            ? "Selected"
                            : "Select";

                    var row =
                        "<tr>" +
                        "<td>" +
                        address.full_name +
                        "</td>" +
                        "<td>" +
                        address.contact +
                        "</td>" +
                        "<td>" +
                        address.email +
                        "</td>" +
                        "<td>" +
                        address.division_name +
                        "</td>" +
                        "<td>" +
                        address.district_name +
                        "</td>" +
                        "<td>" +
                        address.upazila_name +
                        "</td>" +
                        "<td>" +
                        address.address +
                        "</td>" +
                        "<td>" +
                        address.postal_code +
                        "</td>" +
                        "<td><a id='select-existing-address-btn' class='select-existing-address-btn btn btn-solid btn-sm p-1' data-existing-address='" +
                        JSON.stringify(address) +
                        "'>" +
                        buttonText +
                        "</a></td>" +
                        "</tr>";

                    $("#shippingAddressesTable tbody").append(row);
                });
            },
            error: function (error) {
                console.error("Error:", error);
            },
        });
    });

    // Handle the click event for the select button
    $("#shippingAddressesTable").on(
        "click",
        ".select-existing-address-btn",
        function () {
            var addressValues = $(this).data("existing-address");
            selectedAddressId = addressValues.id;

            // Update UI with the selected address
            updateUI(selectedAddressId);

            // Set values in the form
            setValuesInForm(addressValues);
        }
    );

    function updateUI(selectedId) {
        $("#shippingAddressesTable tbody tr").each(function () {
            var currentAddressData = $(this)
                .find(".select-existing-address-btn")
                .data("existing-address");
            var isSelected = currentAddressData.id === selectedId;
            var buttonText = isSelected ? "Selected" : "Select";

            // Update the button text
            $(this).find(".select-existing-address-btn").text(buttonText);
        });
    }

    function setValuesInForm(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var inputElement = $('#newAddressForm [name="' + key + '"]');

                if (inputElement.is('input[type="text"]')) {
                    // Set the value
                    inputElement.val(data[key]);
                } else if (inputElement.is("select")) {
                    // Set the value
                    inputElement.val(data[key]).change();
                }
            }
        }

        var districtValue = data["district_id"];
        var divisionValue = data["division_id"];
        var upazilaValue = data["upazila_id"];

        // Get the select element
        var districtSelect = $("#district");
        var divisionSelect = $("#division");
        var upazilaSelect = $("#upazila");

        // Append the new district as an option with an empty string value
        districtSelect.append(
            "<option value='" + districtValue + "' selected></option>"
        );

        divisionSelect.append(
            "<option value='" + divisionValue + "' selected></option>"
        );

        upazilaSelect.append(
            "<option value='" + upazilaValue + "' selected></option>"
        );

        // Log the values for verification
        console.log(
            "division_id value:",
            $("#newAddressForm [name='district']").val()
        );
    }

    // when click for new address
    $("#newAddressActions").on("click", function () {
        var districtSelect = $("#district");
        var divisionSelect = $("#division");
        var upazilaSelect = $("#upazila");
        var countrySelect = $("#country");
        $("#addressActions").hide();
        $("#newAddressForm").removeAttr("hidden");
        $("#newAddressForm :input").val(null);
        $("#newAddressForm select").val("").change();
        $("#delivery-option-areas").removeAttr("hidden");

        // Append the new district as an option with an empty string value
        districtSelect.append(
            `<option value=""  disabled>Select a district</option>`
        );

        upazilaSelect.append(
            `<option value=""  disabled> Select a upazila</option>`
        );
        countrySelect.empty();

        countrySelect.append(
            `<option value="Bangladesh"  selected>Bangladesh</option>`
        );
    });

    $("body").on("click", "#place-order-btn", function (event) {
        validateForm();
    });

    // validate shipping address input fields

    function validateForm() {
        $(".error-message").empty();
        $(".error-input").removeClass("error-input");

        // Perform validation
        var isValid = true;

        // Validate Full Name
        var fullName = $('input[name="full_name"]').val();
        if (fullName.trim() === "") {
            $("#errorFullName").text("Please enter your full name.");
            $('input[name="full_name"]').addClass("error-input");
            isValid = false;
        } else if (/\d/.test(fullName)) {
            $("#errorFullName").text("Full name should not contain numbers.");
            $('input[name="full_name"]').addClass("error-input");
            isValid = false;
        }

        // Validate Mobile Number
        var mobileNo = $('input[name="mobile_no"]').val();
        if (mobileNo.trim() === "") {
            $("#errorMobileNo").text("Please enter a mobile number.");
            $('input[name="mobile_no"]').addClass("error-input");
            isValid = false;
        } else if (mobileNo.length < 11 || mobileNo.length > 13) {
            $("#errorMobileNo").text(
                "Mobile number must be between 11 and 13 characters."
            );
            $('input[name="mobile_no"]').addClass("error-input");
            isValid = false;
        } else if (isNaN(mobileNo)) {
            $("#errorMobileNo").text("mobile number should be a valid number.");
            $('input[name="mobile_no"]').addClass("error-input");
            isValid = false;
        }

        // Validate Email
        var email = $('input[name="email"]').val();
        if (email.trim() === "" || !isValidEmail(email)) {
            $("#errorEmail").text("Please enter a valid email address.");
            $('input[name="email"]').addClass("error-input");
            isValid = false;
        }

        // Validate Country
        var country = $('select[name="country"]').val();
        if (country.trim() === "") {
            $("#errorCountry").text("Please select your country.");
            $('select[name="country"]').addClass("error-input");
            isValid = false;
        }

        // Validate division
        var division = $('select[name="division"]').val();
        console.log("division", division);
        if (division.trim() === "") {
            $("#errorDivision").text("Please select your division.");
            $('select[name="division"]').addClass("error-input");
            isValid = false;
        }

        // Validate district
        var district = $('select[name="district"]').val();
        if (district.trim() === "") {
            $("#errorDistrict").text("Please select your district.");
            $('select[name="district"]').addClass("error-input");
            isValid = false;
        }

        // Validate upazila
        var upazila = $('select[name="upazila"]').val();
        if (upazila.trim() === "") {
            $("#errorUpazila").text("Please select your upazila.");
            $('select[name="upazila"]').addClass("error-input");
            isValid = false;
        }

        // Validate Address
        var address = $('input[name="address"]').val();
        if (address.trim() === "") {
            $("#errorAddress").text("Please enter your address.");
            $('input[name="address"]').addClass("error-input");
            isValid = false;
        }

        var postalCode = $('input[name="postal_code"]').val();
        if (postalCode.trim() === "") {
            $("#errorPostalCode").text("Please enter your postal code.");
            $('input[name="postal_code"]').addClass("error-input");
            isValid = false;
        } else if (isNaN(postalCode)) {
            $("#errorPostalCode").text("Postal Code should be a valid number.");
            $('input[name="postal_code"]').addClass("error-input");
            isValid = false;
        } else if (postalCode && postalCode.length > 6) {
            $("#errorPostalCode").text(
                "Postal Code cannot be more than 6 characters."
            );
            $('input[name="postal_code"]').addClass("error-input");
            isValid = false;
        }

        // if (isValid) {
        //     $("#bKash_button").click();
        // }

        if (isValid) {
            $("#checkout-submit").prop("disabled", false);
        } else {
            $("#checkout-submit").prop("disabled", true);
        }
    }

    function isValidEmail(email) {
        // Basic email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isFormFilled() {
        // You can customize this function based on your form elements
        var formFields = [
            $('input[name="full_name"]').val(),
            $('input[name="mobile_no"]').val(),
            $('input[name="email"]').val(),
            $('select[name="country"]').val(),
            $('select[name="division"]').val(),
            $('select[name="district"]').val(),
            $('select[name="upazila"]').val(),
            $('input[name="address"]').val(),
            $('input[name="postal_code"]').val(),

            // Add other form fields as needed
        ];

        // Check if all fields have values
        return formFields.every(function (field) {
            return field.trim() !== "";
        });
    }

    // Enable/disable submit button based on form fill-up
    $("#newAddressForm input, #newAddressForm select").on(
        "input change",
        function () {
            var isFilled = isFormFilled();

            $("#checkout-submit").prop("disabled", !isFilled);
        }
    );

    // Show/hide form based on button click
    $("#insertNewAddress").on("click", function () {
        isClickNewAddress = true;

        $("#newAddressForm").toggle();
        // Trigger an input event to check the initial state of the form
        $("#newAddressForm input, #newAddressForm select").trigger("input");
    });

    // Show/hide form based on button click
    $("#useExistingAddress").on("click", function () {
        $("#checkout-submit").prop("disabled", true);
    });

    $("#shippingAddressesTable").on(
        "click",
        ".select-existing-address-btn",
        function () {
            // Enable the checkout-submit button
            $("#checkout-submit").prop("disabled", false);
        }
    );

    $("#identity").on("input", function () {
        validateIdentityField();
    });

    // when click for get user data by identity address
    $("#checkIdentity").on("click", function () {
        var identityValue = $("#identity").val();
        if (validateIdentityField()) {
            $.ajax({
                url: `/checkout/check-identity/${identityValue}`,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    var shippingAddresses = response.allShippingAddress;
                    $("#shippingAddressesTable").show();
                    $("#shippingAddressesTable").removeAttr("hidden");
                    $("#shippingAddressesTable tbody").empty();

                    $.each(shippingAddresses, function (index, address) {
                        var buttonText = "Select";

                        var row =
                            "<tr>" +
                            "<td>" +
                            address.name +
                            "</td>" +
                            "<td>" +
                            address.mobile_no +
                            "</td>" +
                            "<td>" +
                            address.email +
                            "</td>" +
                            "<td>" +
                            address.division_name +
                            "</td>" +
                            "<td>" +
                            address.district_name +
                            "</td>" +
                            "<td>" +
                            address.upazila_name +
                            "</td>" +
                            "<td>" +
                            address.address_line +
                            "</td>" +
                            "<td>" +
                            address.postal_code +
                            "</td>" +
                            "<td><a id='select-existing-address-btn' class='select-existing-address-btn btn btn-solid btn-sm p-1' data-existing-address='" +
                            JSON.stringify(address) +
                            "'>" +
                            buttonText +
                            "</a></td>" +
                            "</tr>";

                        $("#shippingAddressesTable tbody").append(row);
                        $("#delivery-option-areas").removeAttr("hidden");
                    });
                },
                error: function (error) {
                    console.error("Error:", error);
                    $(".identity-error").text(
                        "No shipping address found for the provided identity."
                    );
                    $("#shippingAddressesTable").hide();
                    $("#identity").addClass("error");
                    $("#checkout-submit").prop("disabled", true);
                    $("#delivery-option-areas").attr("hidden", true);
                },
            });
        }
    });

    function validateIdentityField() {
        // Reset error messages and styles
        $(".error-message").text("");
        $("input, select").removeClass("error");
        $("#checkout-submit").prop("disabled", true);

        // Get the value of the identity field
        var identityValue = $("#identity").val();

        // Validate the identity field using jQuery
        if (isNaN(identityValue)) {
            $(".identity-error").text("Please enter a valid numeric identity.");
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
            $("#checkout-submit").prop("disabled", true);
            return false;
        } else if (identityValue.length < 9) {
            $(".identity-error").text(
                "Identity length should be at least 9 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
            $("#checkout-submit").prop("disabled", true);
            return false;
        } else if (identityValue.length > 14) {
            $(".identity-error").text(
                "Identity length should not exceed 14 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
            $("#checkout-submit").prop("disabled", true);
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

    function areAllPaymentInfoInputFieldsValid() {
        var isPaymentMethodSelected =
            $('input[name="manual_payment_method"]:checked').length > 0;
        var isTransactionMobileNumberValid =
            $("#transaction-mobile-number").val().trim().length > 0;
        var isTransactionNumberValid =
            $("#transaction-number").val().trim().length > 0;

        return (
            isPaymentMethodSelected &&
            isTransactionMobileNumberValid &&
            isTransactionNumberValid
        );
    }

    // Function to update the visibility of the submit button
    function updateSubmitButtonVisibility() {
        if (areAllPaymentInfoInputFieldsValid()) {
            if ($("#addressActions:visible").length > 0) {
                if (
                    $(".select-existing-address-btn").text().trim() ===
                    "Selected"
                ) {
                    $("#checkout-submit").prop("disabled", false);
                } else {
                    $("#checkout-submit").prop("disabled", true);
                }
            } else if ($("#newAddressForm:visible").length > 0) {
                validateForm();
            } else if (userType == "admin" || userType == "accountant") {
                if (
                    $(".select-existing-address-btn").text().trim() ===
                    "Selected"
                ) {
                    $("#checkout-submit").prop("disabled", false);
                } else {
                    $("#checkout-submit").prop("disabled", true);
                }
            }
        }
    }

    // Event listeners for input fields
    $(
        'input[name="manual_payment_method"], #transaction-mobile-number, #transaction-number'
    ).on("change input", function () {
        updateSubmitButtonVisibility();
    });

    function updatePickupLocationVisibility() {
        if ($("#pick_up_location").prop("checked")) {
            $("#pickup_location_area").removeAttr("hidden");
            $("#newAddressForm").attr("hidden", true);
            $("#pickup_location_area").show();
            $("#pick_up_location").prop("checked", true);
            var totalPriceTakaString = $("#total_price").text();

            var totalPriceTaka = parseFloat(
                totalPriceTakaString.replace(/[Tk,]/g, "")
            );

            // Add 110 to totalPriceTaka
            var newTotalPrice = totalPriceTaka - 110.0;

            $("#shipping_bv").text(formatTakaWithCommas(110));

            // Update the content of the span with the new value
            $("#total_price").text(formatTakaWithCommas(newTotalPrice) + "Tk");
            $("#shipping_bv").text(`${0} Tk`);
        } else {
            $("#pickup_location_area").attr("hidden", "hidden");
            $("#pickup_location_area").hide();
            $("#pick_up_location").prop("checked", false);

            $("#newAddressForm").removeAttr("hidden");
        }
        var pickupLocationValue = $("#pick_up_location").prop("checked")
            ? 1
            : 0;
        $("#is_pick_up_location").val(pickupLocationValue);
        if ($("#addressActions:visible").length > 0) {
            if (
                $(".select-existing-address-btn").text().trim() === "Selected"
            ) {
                $("#checkout-submit").prop("disabled", false);
            } else {
                $("#checkout-submit").prop("disabled", true);
            }
        } else if ($("#newAddressForm:visible").length > 0) {
            validateForm();
        } else if (userType == "admin" || userType == "accountant") {
            if (
                $(".select-existing-address-btn").text().trim() === "Selected"
            ) {
                $("#checkout-submit").prop("disabled", false);
            } else {
                $("#checkout-submit").prop("disabled", true);
            }
        }
    }

    // Initial call to set visibility on page load
    updatePickupLocationVisibility();

    // Event listener for radio button change
    $('input[name="delivery_option_checkbox"]').on("change", function () {
        updatePickupLocationVisibility();
    });

    $("#ship_order").on("change", function () {
        var shippingCostValue = $(this).prop("checked") ? 110 : 0.0;
        $("#shipping_cost").val(shippingCostValue);
        $("#shipping_bv").text(
            `${formatTakaWithCommas(shippingCostValue) + " " + "Tk"}`
        );
        var currentSubtotalBvString = $("#subtotal_bv").text();
        var totalPriceTakaString = $("#total_price").text();

        // Convert the current value to a number, add 0.88, and convert back to a string
        // var currentSubtotalBv = parseFloat(
        //     currentSubtotalBvString.replace(/[BV,]/g, "")
        // );
        // var newSubtotalBv = (parseFloat(currentSubtotalBv) + 0.88).toFixed(4);
        var totalPriceTaka = parseFloat(
            totalPriceTakaString.replace(/[Tk,]/g, "")
        );

        // Add 110 to totalPriceTaka
        var newTotalPrice = totalPriceTaka + 110;

        // Update the content of the span with the new value
        // $("#subtotal_bv").text(
        //     "BV" + " " + formatNumberWithCommas(newSubtotalBv)
        // );
        $("#total_price").text(
            formatTakaWithCommas(newTotalPrice) + " " + "Tk"
        );
        $("#shipping_cost").val("110.00 Tk");
        if ($("#addressActions:visible").length > 0) {
            if (
                $(".select-existing-address-btn").text().trim() === "Selected"
            ) {
                $("#checkout-submit").prop("disabled", false);
            } else {
                $("#checkout-submit").prop("disabled", true);
            }
        } else if ($("#newAddressForm:visible").length > 0) {
            validateForm();
        } else if (userType == "admin" || userType == "accountant") {
            if (
                $(".select-existing-address-btn").text().trim() === "Selected"
            ) {
                $("#checkout-submit").prop("disabled", false);
            } else {
                $("#checkout-submit").prop("disabled", true);
            }
        }
    });

    function formatTakaWithCommas(number) {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const formattedNumber = formatter.format(number);

        return formattedNumber;
    }

    function formatNumberWithCommas(number) {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "decimal",
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        });

        const formattedNumber = formatter.format(number);

        return formattedNumber;
    }
});
