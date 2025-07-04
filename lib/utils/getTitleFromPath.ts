import { IPage, PAGE } from "@/constants";

function flattenPageObject(
  obj: Record<string, IPage>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [_, value] of Object.entries(obj)) {
    const currentPath = `${value.pathPrefix.toLowerCase()}`;
    result[currentPath] = value.name;
  }

  return result;
}

const pathMap = flattenPageObject(PAGE);

export function getTitleFromPath(pathname: string): string {
  const normalizedPath = pathname.toLowerCase();

  // Ищем самое длинное совпадение с ключом в pathMap
  const matchedPath = Object.keys(pathMap)
    .sort((a, b) => b.length - a.length)
    .find((key) => normalizedPath.startsWith(key));

  return matchedPath ? pathMap[matchedPath] : 'Страница';
}
