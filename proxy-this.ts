import { proxy, ref } from "valtio";

class User {
  name = "John";

  // Pet constructor receives a plain User instance,
  // not a proxy object!
  pet = ref(new Pet("Fido", this));

  age = 100;
}

class Pet {
  constructor(public name: string, public owner: User) {}
  setOwnerName(name: string) {
    // This updates the plain User instance, not the proxy!
    this.owner.name = name;
  }
  getOwnerName() {
    return this.owner.name;
  }
}

const user = proxy(new User());
user.name = "Mary";
console.log(user.pet.getOwnerName());
console.log(user.name);
