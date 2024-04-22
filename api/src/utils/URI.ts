export default class URI {
  static str_to_uri(name: string){
    name = name.replaceAll(/[\s]+/gm, '_');
    name = name.toLocaleLowerCase();
    return name;
  }
}