import { Separator } from 'inquirer';

export default function getSubgeneratorOptions(subgenerators) {
  return Object.values(subgenerators)
    // Sort by label.
    .sort(({ namespace: namespaceA }, { namespace: namespaceB }) => {
      if (namespaceA && namespaceB) {
        return namespaceA.localeCompare(namespaceB);
      }
      return 0;
    })
    // Sort by category.
    .sort(({ category: categoryA }, { category: categoryB }) => {
      if (categoryA && categoryB) {
        return categoryA.localeCompare(categoryB);
      }
      return 0;
    })
    /** @todo Add category separators **/
    // Map to what Inquirer.js expects for options.
    .map((option) => {
      if (option instanceof Separator) {
        return option;
      }
      return {
        name: option.name,
        value: option.machineName,
      };
    });
}
