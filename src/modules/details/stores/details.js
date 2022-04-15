import httpClient from "utils/httpClient";

class DetailsStore {
	getPokemonByName = async (name) => {
		const { data } = await httpClient.get(`/pokemon/${name}`);

		return data;
	};

	getFlavorText = async (pokemonId) => {
		const { data } = await httpClient.get(`/pokemon-species/${pokemonId}/`);
		const flavorText = data.flavor_text_entries.find((item) => item.language.name === "en").flavor_text;

		return flavorText;
	};

	getAbilityDetails = async (abilityName) => {
		const { data } = await httpClient.get(`/ability/${abilityName}/`);

		const name = data.name;
		const effectDetails = data.effect_entries.find((effect) => effect.language.name === "en");

		return { effectDetails, name };
	};
}

export default new DetailsStore();