<template>
  <li
    class="a5e-box a5e-item a5e-js-item u-align-center"
    :class="{
      'u-bg-light-green': item.system.equipped || item.system.prepared,
    }"
    :data-id="item._id"
    :data-item-id="item._id"
    draggable="true"
    @click.left.self="onToggleDescriptionVisibility"
    @click.middle.self="onEditItem"
  >
    <img
      :src="item.img"
      :title="item.name"
      class="a5e-image a5e-image--item-inline"
      @click.exact.stop="onActivateItem()"
      @click.shift.exact.stop="onActivateItem('advantage')"
      @click.ctrl.exact.stop="onActivateItem('disadvantage')"
      @click.meta.exact.stop="onActivateItem('disadvantage')"
    />

    <div
      class="u-flex u-flex-col u-gap-xs u-py-xs"
      @click.left="onToggleDescriptionVisibility"
      @click.middle="onEditItem"
    >
      <div class="u-align-center u-flex u-gap-xl u-text-sm">
        <div class="u-align-center u-flex u-gap-md u-text-xs">
          <h3 class="u-align-center u-flex u-h-5 u-text-sm">
            {{ item.name }}
          </h3>

          <div v-if="item.system.quantity > 1">
            <input
              class="a5e-input a5e-input--inline-item"
              type="number"
              @click.stop=""
              v-model="quantity"
              v-autowidth
              min="0"
            />
          </div>
        </div>

        <div v-if="hasUses" class="u-align-center u-flex u-gap-ch u-text-xs">
          <input
            class="a5e-input a5e-input--inline-item"
            type="number"
            @click.stop=""
            v-model="usesRemaining"
            v-autowidth
            min="0"
          />

          <span v-if="item.system.uses.max"> / </span>

          <input
            v-if="item.system.uses.max"
            class="a5e-input a5e-input--inline-item"
            type="number"
            @click.stop=""
            v-model="maxUses"
            v-autowidth
            min="0"
          />

          <span v-if="item.system.uses.per">
            Per
            {{ localize(config.resourceRecoveryOptions[item.system.uses.per]) }}
          </span>
        </div>
      </div>

      <feature-item-tags v-if="item.type === 'feature'" :item="item" />
      <maneuver-item-tags v-if="item.type === 'maneuver'" :item="item" />
      <object-item-tags v-if="item.type === 'object'" :item="item" />
      <spell-item-tags v-if="item.type === 'spell'" :item="item" />
    </div>

    <item-action-buttons :item="item" />

    <div v-if="descriptionVisible" class="a5e-item__details">
      <hr class="a5e-rule" />

      <maneuver-item-details v-if="item.type === 'maneuver'" :item="item" />
      <spell-item-details v-if="item.type === 'spell'" :item="item" />
      <hr v-if="['maneuver', 'spell'].includes(item.type)" class="a5e-rule" />

      <div
        v-html="
          TextEditor.enrichHTML(item.system.description, { async: false })
        "
        v-if="item.system.description"
        class="a5e-editor"
        @click.prevent
      ></div>

      <div v-else>
        {{ localize("A5E.NoDescription") }}
      </div>
    </div>
  </li>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { directive as VueInputAutowidth } from "vue-input-autowidth";

import FeatureItemTags from "./itemTags/FeatureItemTags.vue";
import ItemActionButtons from "./ItemActionButtons.vue";
import ManeuverItemDetails from "./itemDetails/ManeuverItemDetails.vue";
import ManeuverItemTags from "./itemTags/ManeuverItemTags.vue";
import ObjectItemTags from "./itemTags/ObjectItemTags.vue";
import SpellItemDetails from "./itemDetails/SpellItemDetails.vue";
import SpellItemTags from "./itemTags/SpellItemTags.vue";

export default {
  components: {
    FeatureItemTags,
    ItemActionButtons,
    ManeuverItemDetails,
    ManeuverItemTags,
    ObjectItemTags,
    SpellItemDetails,
    SpellItemTags,
  },
  directives: { autowidth: VueInputAutowidth },
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");
    const sheet = inject("sheet");
    const descriptionVisible = ref(false);

    const hasUses = computed(() => {
      const { uses } = props.item.system;
      return uses.value || uses.max;
    });

    const maxUses = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.system.uses.max;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "system.uses.max": value });
      },
    });

    const quantity = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.system.quantity;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "system.quantity": value });
      },
    });

    const usesRemaining = computed({
      get: () => {
        const item = actor.items.get(props.item._id);
        return item.system.uses.value || 0;
      },
      set: (value) => {
        const item = actor.items.get(props.item._id);
        item.update({ "system.uses.value": value });
      },
    });

    function onActivateItem(rollMode) {
      const options = {};
      const item = actor.items.get(props.item._id);

      if (rollMode) {
        options["rollMode"] = CONFIG.A5E.ROLL_MODE[rollMode.toUpperCase()];
      }

      item.activate(options);
    }

    function onEditItem() {
      actor.items.get(props.item._id).sheet.render(true);
    }

    function onToggleDescriptionVisibility() {
      descriptionVisible.value = !descriptionVisible.value;
    }

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    return {
      config: CONFIG.A5E,
      descriptionVisible,
      hasUses,
      localize: (key) => game.i18n.localize(key),
      maxUses,
      onActivateItem,
      onEditItem,
      onToggleDescriptionVisibility,
      quantity,
      usesRemaining,
      TextEditor,
    };
  },
};
</script>
