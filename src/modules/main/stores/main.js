import { httpPokeApi } from "utils/httpClient";

class MainStore {
  getPokemonByName = async (pokemon) => {
    try {
      if (!pokemon) return;

      const { data } = await httpPokeApi.get(`/pokemon/${pokemon}`);

      return data;
    } catch (error) {
      return null;
    }
  };

  getDescriptionPokemon = async (url) => {
    const id = url.split("/")[6];
    const { data } = await httpPokeApi.get(`/pokemon-species/${id}/`);
    const description = data.flavor_text_entries.find((item) => item.language.name === "en");

    return (description && description.flavor_text) || "";
  };

  getAbility = async (ability) => {
    const { data } = await httpPokeApi.get(`/ability/${ability}`);

    return data;
  };

  pokemonDataBuilder = async (pokemon) => {
    const cachedPokemons = () => JSON.parse(localStorage.getItem("pokemons"));
    if (!cachedPokemons()) localStorage.setItem("pokemons", JSON.stringify({}));

    const pokemonCached = cachedPokemons()[pokemon];
    if (pokemonCached) return pokemonCached;

    pokemon = await this.getPokemonByName(pokemon);

    if (!pokemon) return null;

    const pokemonFormated = {
      name: pokemon.name,
      image: pokemon.sprites && pokemon.sprites.front_default || null,
      abilities: pokemon.abilities,
      description: await this.getDescriptionPokemon(pokemon.species.url),
    };

    const abilitiesNames = pokemon.abilities.map((ability) => ability.ability.name);

    for (const [index, name] of abilitiesNames.entries()) {
      const ability = await this.getAbility(name);
      const effect = ability.effect_entries.find((effect) => effect.language.name === "en");

      pokemonFormated.abilities[index] = {
        name: ability.name,
        effect: (effect && effect.short_effect) || "",
      };
    }

    const newStorage = {
      ...cachedPokemons(),
      [pokemonFormated.name]: pokemonFormated,
    };

    localStorage.setItem("pokemons", JSON.stringify(newStorage));

    return pokemonFormated;
  };

  getPokemonOffset = async (page) => {
    const offset = (page - 1) * 24;
    const { data } = await httpPokeApi.get(`/pokemon?limit=24&offset=${offset}`);

    return data;
  };

  loadData = async (page) => {
    const { results } = await this.getPokemonOffset(page);
    return results.map((pokemon) => pokemon.name);
  };
}

export default new MainStore();
