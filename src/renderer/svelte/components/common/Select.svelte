<script>
  export let options;
  export let handleOptionClick;
  let currentSelection;
  let showOptions = false;

  function toggleShowOptions() {
    showOptions = !showOptions;
  }

  function onOptionClick(event, option) {
    currentSelection = option.label;
    handleOptionClick(option);
    showOptions = false;
  }

  $: {
    // Reset currentSelecton when options has changed
    if (options.length > 0) {
      currentSelection = options[0].label;
    }
  }
</script>

<style>
  .select-box {
    position: relative;
    /* width: 150px; */
    display: flex;
  }

  .select-box__current {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 3px solid var(--color-action);
    border-radius: 6px;
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    outline: none;
  }
  .select-box__icon {
    transform: rotate(-90deg);
    margin-right: 5px;
  }
  .select-box__icon[data-open='true'] {
    transform: rotate(90deg);
  }

  .select-box__value {
    display: flex;
    width: 100%;
    margin: 0;
    padding: 10px 15px;
  }

  .select-box__list {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    padding: 0;
    list-style: none;
    background: var(--bg-color-dark);
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 10;
  }
  .select-box__list[data-show='true'] {
    display: block;
  }
  .select-box__option {
    padding: 15px;
    cursor: pointer;
  }
  .select-box__option[disabled='true'] {
    color: var(--font-color-blur);
    pointer-events: none;
  }
  .select-box__option:not([disabled='true']):hover,
  .select-box__option:not([disabled='true']):focus {
    background: var(--bg-color-light);
  }
</style>

<div class="select-box">
  <div class="select-box__current" on:click={toggleShowOptions}>
    {#if currentSelection}
      <div class="select-box__value">{currentSelection}</div>
    {/if}
    <div
      class="select-box__icon"
      data-open={showOptions}
      aria-hidden="true">
      >
    </div>
  </div>
  <ul class="select-box__list" data-show={showOptions}>
    {#each options as option}
      <li
        class="select-box__option"
        disabled={currentSelection === option.label}
        on:click={event => onOptionClick(event, option)}>
        {option.label}
      </li>
    {/each}
  </ul>
</div>
