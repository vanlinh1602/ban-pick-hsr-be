/* eslint-disable camelcase */
import fs from 'fs';
import { HoyoWiki, HSRMenuEnum, LanguageEnum } from 'michos_api';
import * as path from 'path';

export const fetchData = async () => {
  const directoryPath = path.join(__dirname, '../resources');
  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Fetch characters from Hoyolab API
  const hsrWiki = new HoyoWiki({ lang: LanguageEnum.VIETNAMESE });
  const charactersWiki = await Promise.all(
    [1, 2].map((page) => {
      return hsrWiki.hsr.characters(page, 50);
    })
  );

  const characters: any = {};
  await Promise.all(
    charactersWiki.flat().map(async (char) => {
      const charData = await hsrWiki.hsr.characterDetail(char.entry_page_id);
      characters[char.entry_page_id] = {
        id: char.entry_page_id,
        name: char.name,
        icon: char.icon_url,
        background: charData.header_img_url,
        paths: charData.filter_values.character_paths.value_types,
        rarity: charData.filter_values.character_rarity.value_types,
        combatType: charData.filter_values.character_combat_type.value_types,
        factions: charData.filter_values.character_factions?.value_types || [],
      };
    })
  );
  fs.writeFileSync('./src/resources/characters.json', JSON.stringify(characters, null, 2));

  // Fetch light cones from Hoyolab API
  const lightConesWiki = await Promise.all(
    [1, 2, 3].map((page) => {
      return hsrWiki.hsr.lightCones(page, 50);
    })
  );
  const lightCones: any = {};
  await Promise.all(
    lightConesWiki.flat().map(async (lc) => {
      const lcData = await hsrWiki.hsr.lightConeDetail(lc.entry_page_id);
      lightCones[lc.entry_page_id] = {
        id: lc.entry_page_id,
        name: lc.name,
        icon: lc.icon_url,
        background: lcData.header_img_url,
        rarity: lcData.filter_values.equipment_rarity.value_types,
        skillType: lcData.filter_values.equipment_skill_type?.value_types || [],
        source: lcData.filter_values.equipment_source?.value_types || [],
        paths: lcData.filter_values.equipment_paths.value_types,
      };
    })
  );
  fs.writeFileSync('./src/resources/lightCones.json', JSON.stringify(lightCones, null, 2));

  // Fetch filters characters from Hoyolab API
  const filterCharacter: any = {};
  const filterCharacterWiki = await hsrWiki.hsr.menuFilters(HSRMenuEnum.CHARACTER);
  filterCharacterWiki.forEach((filter) => {
    filterCharacter[filter.key] = {
      key: filter.key,
      text: filter.text,
      values: filter.values,
    };
  });

  fs.writeFileSync(
    './src/resources/filterCharacter.json',
    JSON.stringify(filterCharacter, null, 2)
  );

  // Fetch filters light cones from Hoyolab API
  const filterLightCone: any = {};
  const filterLightConeWiki = await hsrWiki.hsr.menuFilters(HSRMenuEnum.LIGHT_CONE);
  filterLightConeWiki.forEach((filter) => {
    filterLightCone[filter.key] = {
      key: filter.key,
      text: filter.text,
      values: filter.values,
    };
  });
  fs.writeFileSync(
    './src/resources/filterLightCone.json',
    JSON.stringify(filterLightCone, null, 2)
  );
};

fetchData();
