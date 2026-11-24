"use strict";

$(document).ready(function () {
  loadCaféMenu();
});

/**
 * Fetches menu items from local JSON via jQuery AJAX
 * and renders them into #menu-grid.
 */
function loadCaféMenu() {
  const $menuGrid = $("#menu-grid");

  $.ajax({
    url: "data/menu.json",
    method: "GET",
    dataType: "json"
  })
    .done(function (data) {
      // Clear the loading message
      $menuGrid.empty();

      // Verify menuItems array exists and has content
      if (!data || !Array.isArray(data.menuItems) || data.menuItems.length === 0) {
        $menuGrid.html("<p>No menu items are currently available.</p>");
        return;
      }

      // Loop through each item and build a semantic card
      $.each(data.menuItems, function (_index, item) {
        const $card = $("<article>", { class: "menu-card" });

        const $img = $("<img>", {
          src: item.image,
          alt: item.alt,
          class: "menu-card-img"
        });

        const $body = $("<div>", { class: "menu-card-body" });

        const $header = $("<div>", { class: "menu-card-header" }).append(
          $("<h3>", { text: item.name }),
          $("<span>", { class: "menu-price", text: item.price })
        );

        const $meta = $("<p>", {
          class: "menu-meta",
          text: `${item.category} • ${item.roast}`
        });

        const $desc = $("<p>", {
          class: "menu-desc",
          text: item.description
        });

        $body.append($header, $meta, $desc);
        $card.append($img, $body);
        $menuGrid.append($card);
      });
    })
    .fail(function (_jqXHR, textStatus, errorThrown) {
      $menuGrid.html(
        "<p class='error-msg'>Unable to load the menu right now. Please refresh the page.</p>"
      );
      console.warn("Menu AJAX request failed:", textStatus, errorThrown);
    });
}

"use strict";

const STORAGE_KEY = "sunValleyFavoriteOrder";

$(document).ready(function () {
  // Check localStorage immediately when the page loads
  displaySavedOrder();

  // Handle form submission to save the order
  $("#favorite-order-form").on("submit", function (event) {
    event.preventDefault();

    const orderData = {
      name: $("#customer-name").val().trim(),
      drink: $("#favorite-drink").val(),
      milk: $("#milk-choice").val(),
      temp: $("#temp-choice").val()
    };

    if (!orderData.name || !orderData.drink) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orderData));
      displaySavedOrder();
    } catch (error) {
      console.warn("Could not save order to localStorage:", error);
    }
  });

  // Handle clearing the saved order
  $("#clear-order-btn").on("click", function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
      $("#saved-order-banner").attr("hidden", true);
      $("#favorite-order-form")[0].reset();
    } catch (error) {
      console.warn("Could not remove order from localStorage:", error);
    }
  });
});

/**
 * Reads saved order data from localStorage on page load or update
 * and renders the personalized welcome banner.
 */
function displaySavedOrder() {
  let rawData = null;

  try {
    rawData = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to read from localStorage:", error);
    return;
  }

  if (!rawData) {
    return;
  }

  try {
    const savedOrder = JSON.parse(rawData);

    // Build text safely using .text() to prevent HTML injection
    const message = `Welcome back, ${savedOrder.name}! Your usual order: ${savedOrder.temp} ${savedOrder.drink} (${savedOrder.milk}).`;

    $("#saved-order-text").text(message);
    $("#saved-order-banner").removeAttr("hidden");

    // Pre-fill the form inputs so the user sees their saved selections
    $("#customer-name").val(savedOrder.name);
    $("#favorite-drink").val(savedOrder.drink);
    $("#milk-choice").val(savedOrder.milk);
    $("#temp-choice").val(savedOrder.temp);
  } catch (error) {
    console.warn("Corrupted localStorage data cleared:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}