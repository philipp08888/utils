export interface Test {
  name: string;
  var: number;
}

function testN(): Test {
  return { name: "test", var: 123 };
}

testN();
