<template>
  <ul
    v-if="tags.length"
    class="u-flex u-flex-wrap u-gap-xs u-list-style-none u-m-0 u-p-0 u-text-xxs"
  >
    <span
      v-for="tag in tags"
      :key="tag"
      class="a5e-tag a5e-tag--light a5e-tag--tight"
    >
      {{ tag }}
    </span>
  </ul>
</template>

<script>
import { computed, inject } from "@vue/runtime-core";
import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

export default {
  props: { item: Object },
  setup(props) {
    const actor = inject("actor");

    const tags = computed(() => {
      const config = CONFIG.A5E;
      const item = actor.items.get(props.item._id);
      const itemData = item.system;

      const tagList = [];

      if (itemData.featureType) {
        tagList.push(
          game.i18n.localize(config.featureTypes[itemData.featureType])
        );
      }

      if (
        Array.isArray(itemData.range) &&
        itemData.range.filter(Boolean).length
      ) {
        const rangeComponents = [game.i18n.localize("A5E.ItemRange"), "-"];
        rangeComponents.push(prepareRangeSummary(itemData.range));
        tagList.push(rangeComponents.join(" "));
      }

      return tagList;
    });

    return {
      localize: (key) => game.i18n.localize(key),
      tags,
    };
  },
};
</script>
