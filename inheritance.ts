import { proxy } from "valtio";

function logEval(expr: string) {
  console.log(`${expr} ===`, eval(expr));
}

class ValtioProxy {
  constructor() {
    return proxy(this);
  }
}

abstract class A extends ValtioProxy {
  constructor() {
    super();
  }
  foo = {
    name: "abc",
  };
}

class B extends A {
  bar = {
    age: 123,
  };

  constructor(readonly baz = "asdf") {
    super();
  }
}

const p = proxy(new B());
logEval("p");
logEval("p instanceof ValtioProxy");
logEval("p instanceof A");
logEval("p instanceof B");
