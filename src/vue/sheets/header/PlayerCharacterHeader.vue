<template>
  <header class="a5e-sheet-header">
    <div class="a5e-sheet-header__left">
      <img
        :src="data.img"
        :title="data.name"
        data-edit="img"
        class="a5e-image a5e-image--actor-header"
      />

      <status-track
        icon="fa-running"
        name="fatigue"
        tooltip-text="A5E.Fatigue"
        :value="data.data.attributes.fatigue"
      />

      <status-track
        icon="fa-brain"
        name="strife"
        tooltip-text="A5E.Strife"
        :value="data.data.attributes.strife"
      />

      <death-save-overlay
        v-if="data.data.attributes.hp.value === 0"
        :success="data.data.attributes.death.success"
        :failure="data.data.attributes.death.failure"
      />

      <Health :hp="data.data.attributes.hp" :sheetIsLocked="sheetIsLocked" />
    </div>

    <div class="u-flex u-gap-xl">
      <div class="u-flex-grow">
        <div
          v-if="sheetIsLocked"
          class="u-align-center u-flex u-font-serif u-h-8 u-text-xxl"
        >
          {{ data.name }}
        </div>

        <input
          v-else
          type="text"
          name="name"
          data-dtype="String"
          :value="data.name"
          class="a5e-input a5e-input--character-name"
          placeholder="Name"
        />

        <div v-if="data.type === 'character'" class="u-flex u-text-medium">
          <div
            v-if="sheetIsLocked"
            class="a5e-input--classes u-align-center u-flex"
          >
            {{ data.data.details.classes }}
          </div>

          <input
            v-else
            class="a5e-input a5e-input--classes"
            type="text"
            data-dtype="String"
            name="data.details.classes"
            :value="data.data.details.classes"
            placeholder="Class"
          />
        </div>
      </div>

      <div class="a5e-sheet-header__shields">
        <div
          v-if="
            data.type === 'npc' && (!sheetIsLocked || data.data.details.elite)
          "
          class="a5e-header-shield a5e-header-shield--elite"
          :class="{
            'a5e-header-shield--active-elite': data.data.details.elite,
            'u-pointer-unset': sheetIsLocked,
          }"
          @click="!sheetIsLocked && onToggleElite()"
        >
          <i class="fas fa-skull"></i>
          <span class="a5e-header-shield__label">
            {{ localize("A5E.Elite") }}
          </span>
        </div>

        <div
          v-if="data.type === 'character'"
          class="a5e-header-shield a5e-header-shield--inspiration"
          :class="{
            'a5e-header-shield--active-inspiration':
              data.data.attributes.inspiration,
          }"
          @click="onToggleInspiration"
        >
          <i class="fas fa-dice-d20"></i>
          <span class="a5e-header-shield__label">
            {{ localize("A5E.Inspiration") }}
          </span>
        </div>

        <div v-if="data.type === 'npc'" class="a5e-header-shield">
          <input
            class="a5e-input a5e-input--cr"
            name="data.details.cr"
            type="text"
            :value="challengeRating"
          />

          <span class="a5e-header-shield__label">
            {{ localize("A5E.ChallengeRatingAbbr") }}
          </span>
        </div>

        <div v-if="data.type === 'character'" class="a5e-header-shield">
          <input
            class="a5e-input a5e-input--level"
            name="data.details.level"
            type="number"
            data-dtype="Number"
            min="1"
            :value="data.data.details.level"
          />

          <span class="a5e-header-shield__label">
            {{ localize("A5E.Level") }}
          </span>
        </div>

        <div class="a5e-header-shield">
          +{{ data.data.attributes.prof }}
          <span class="a5e-header-shield__label">
            {{ localize("A5E.ProficiencyBonusAbbr") }}
          </span>
        </div>

        <div v-if="data.type === 'character'" class="a5e-header-shield">
          <input
            class="a5e-input a5e-input--level"
            name="data.details.prestige"
            type="number"
            data-dtype="Number"
            min="1"
            :value="data.data.details.prestige"
          />

          <span class="a5e-header-shield__label">
            {{ localize("A5E.Prestige") }}
          </span>
        </div>

        <div
          class="
            u-align-center
            u-flex
            u-justify-center
            u-h-8
            u-hover-scale-120
            u-pointer
            u-text-xxl
            u-transition
            u-w-8
          "
        >
          <i
            v-if="sheetIsLocked"
            class="u-text-red fas fa-lock"
            @click.prevent="onToggleSheetLockedState(false)"
          ></i>

          <i
            v-else
            class="u-text-green fas fa-unlock"
            @click.prevent="onToggleSheetLockedState(true)"
          ></i>
        </div>
      </div>
    </div>

    <div v-if="data.type === 'character'" class="u-flex u-flex-wrap u-gap-md">
      <creature-types
        :sheetIsLocked="sheetIsLocked"
        :creature-types="
          data.data.details.creatureTypes.sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
          )
        "
      />

      <size-category
        :sheetIsLocked="sheetIsLocked"
        :size-category="data.data.traits.size"
      />

      <heritage
        :sheetIsLocked="sheetIsLocked"
        :heritage="data.data.details.heritage"
      />

      <culture
        :sheetIsLocked="sheetIsLocked"
        :culture="data.data.details.culture"
      />

      <background
        :sheetIsLocked="sheetIsLocked"
        :background="data.data.details.background"
      />

      <movement
        :sheetIsLocked="sheetIsLocked"
        :movement="data.data.attributes.movement"
      />
    </div>

    <template v-else>
      <div class="u-flex u-flex-wrap u-gap-md">
        <creature-types
          :sheetIsLocked="sheetIsLocked"
          :creature-types="
            data.data.details.creatureTypes.sort((a, b) =>
              a.toLowerCase().localeCompare(b.toLowerCase())
            )
          "
        />

        <size-category
          :sheetIsLocked="sheetIsLocked"
          :size-category="data.data.traits.size"
        />
      </div>

      <movement
        :sheetIsLocked="sheetIsLocked"
        :movement="data.data.attributes.movement"
      />
    </template>

    <div>
      <ul class="u-flex u-font-serif u-gap-md u-list-style-none u-m-0 u-pl-0">
        <armor-class :sheetIsLocked="sheetIsLocked" />
        <initiative :sheetIsLocked="sheetIsLocked" />

        <ability-score
          v-for="[key, ability] in Object.entries(data.data.abilities)"
          :key="key"
          :label="key"
          :ability="ability"
          :sheetIsLocked="sheetIsLocked"
        />
      </ul>
    </div>
  </header>
</template>

<script>
import { computed, inject } from "vue";

import prepareChallengeRating from "../../utils/dataPreparationHelpers/prepareChallengeRating";

import AbilityScore from "./partials/AbilityScore.vue";
import ArmorClass from "./partials/ArmorClass.vue";
import Background from "./partials/Background.vue";
import Culture from "./partials/Culture.vue";
import CreatureTypes from "./partials/CreatureTypes.vue";
import DeathSaveOverlay from "./partials/DeathSaveOverlay.vue";
import Health from "./partials/Health.vue";
import Heritage from "./partials/Heritage.vue";
import Initiative from "./partials/Initiative.vue";
import Movement from "./partials/Movement.vue";
import SizeCategory from "./partials/SizeCategory.vue";
import StatusTrack from "./partials/StatusTrack.vue";

export default {
  components: {
    AbilityScore,
    ArmorClass,
    Background,
    CreatureTypes,
    Culture,
    DeathSaveOverlay,
    Health,
    Heritage,
    Initiative,
    Movement,
    SizeCategory,
    StatusTrack,
  },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheetIsLocked = inject("sheetIsLocked");

    const challengeRating = computed(() => {
      if (data.value.type !== "npc") return null;
      return prepareChallengeRating(data);
    });

    function onToggleInspiration() {
      actor.toggleInspiration();
    }

    function onToggleSheetLockedState() {
      const currentState = data.value.flags?.a5e?.sheetIsLocked;
      actor.setFlag("a5e", "sheetIsLocked", !currentState);
    }

    return {
      challengeRating,
      data,
      localize: (key) => game.i18n.localize(key),
      onToggleInspiration,
      onToggleSheetLockedState,
      sheetIsLocked,
    };
  },
};
</script>
