function linkedCheckboxes(widget) {
  const controllingBox = widget.querySelector("[kjs-role=controlling]");
  const relatedBoxes = widget.querySelectorAll("[kjs-role=related]");

  /**
   *
   * @param { InputEvent } e
   * @returns { { allChecked: boolean, someUnchecked: boolean, someChecked: boolean } } allChecked, someUnchecked, someChecked
   *
   */
  function handleRelatedCheck(e) {
    let someUnchecked = false;
    let someChecked = false;
    let allChecked = true;

    relatedBoxes.forEach((related) => {
      if (related.checked == true) {
        someChecked = true;
      } else {
        someUnchecked = true;
        allChecked = false;
      }
    });
    // if all related boxes are checked, the controlling box should be checked
    if (allChecked === true) {
      controllingBox.indeterminate = false;
      controllingBox.checked = true;
      return { allChecked, someUnchecked, someChecked };
    }
    // if someChecked and someUnchecked, the controlling box should be indeterminate
    // given that not all related boxes are checked
    if (someChecked === someUnchecked) {
      controllingBox.indeterminate = true;
      controllingBox.checked = false;
      return { allChecked, someUnchecked, someChecked };
    }

    // if no related boxes are checked, the controlling box should be unchecked
    if (someChecked === false) {
      controllingBox.indeterminate = false;
      controllingBox.checked = false;
      return { allChecked, someUnchecked, someChecked };
    }
  }

  function handleControllingCheck(e) {
    if (controllingBox.checked === true) {
      // this will be true if the user clicked on the controlling box
      // we need to validate the state of the related boxes and set the controlling box accordingly
      const { someChecked, someUnchecked } = handleRelatedCheck();
      if (someChecked === someUnchecked) {
        controllingBox.indeterminate = false;
        controllingBox.checked = false;
        relatedBoxes.forEach((related) => {
          related.checked = false;
        });
        return;
      }
      controllingBox.indeterminate = false;
      controllingBox.checked = true;
      relatedBoxes.forEach((related) => {
        related.checked = true;
      });
      return;
    }
    if (controllingBox.checked === false) {
      relatedBoxes.forEach((related) => {
        related.checked = false;
      });
      return;
    }
  }

  // initialize actions with the controlling box
  let actions = [
    {
      element: controllingBox,
      event: "change",
      handler: handleControllingCheck,
    },
  ];

  // add actions for each related box
  relatedBoxes.forEach((related) => {
    actions.push({
      element: related,
      event: "change",
      handler: handleRelatedCheck,
    });
  });

  return { actions };
}

module.exports = linkedCheckboxes;
