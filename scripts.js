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