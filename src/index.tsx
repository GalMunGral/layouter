import { Display } from "./Display.js";
import { HStack } from "./HStack.js";
import { Image } from "./Image.js";
import { Observable } from "./Observable.js";
import { Text } from "./Text.js";
import { Video } from "./Video.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";

function Test<T>(type: new (p: T) => any, props: T, ...children: any[]) {
  return new type({ ...props, children });
}
const store = {
  _test: false,
  _sub: [] as ((v: boolean) => void)[],
  get test() {
    return this._test;
  },
  set test(v) {
    this._test = v;
    this._sub.forEach((f) => f(v));
  },
};

const ob = new Observable<boolean>((h) => {
  store._sub.push((v) => {
    h(v);
  });
});

new Display(
  (
    <VStack backgroundColor={[0, 0, 0, 1]}>
      <HStack
        dimension={[Infinity, 100]}
        backgroundColor={[255, 0, 0, 1]}
        margin={[10, 10, 10, 10]}
        shadowColor={[255, 255, 0, 1]}
        shadowOffset={[0, 0]}
        shadowBlur={20}
        borderWidth={4}
        borderColor={[255, 255, 255, 1]}
        borderRadius={[10, 20, 30, 40]}
      >
        <Text
          size={20}
          padding={[10, 10, 10, 10]}
          onClick={() => (store.test = !store.test)}
        >
          啦啦啦 TEST sdfsdf asdf asldkfj asd lasdjflaksd jflaksdjf; alk sdf;
          alsdkfja; lsdkfj alksdjf lskdjfkdjf sdf sdkfj skdjfwlek jwl sodifu
          wlekj lskdf uwoekrjfl kjsdlf iu
        </Text>
        <Video
          visible={ob}
          backgroundColor={[255, 255, 255, 0.5]}
          dimension={[500, 300]}
          objectFit="contain"
          url="test.mp4"
        />
      </HStack>
      <VStack
        dimension={[Infinity, 100]}
        backgroundColor={[0, 0, 0, 1]}
        margin={[10, 10, 10, 10]}
        shadowColor={[255, 255, 9, 1]}
        shadowOffset={[0, 0]}
        shadowBlur={20}
        borderWidth={4}
        borderColor={[255, 255, 255, 1]}
        borderRadius={[10, 20, 30, 40]}
      >
        <HStack>
          <VStack
            dimension={[100, Infinity]}
            margin={[10, 10, 10, 10]}
            backgroundColor={[255, 255, 255, 1]}
            borderRadius={[10, 10, 10, 10]}
            weight={2}
          >
            <Text
              fontFamily={ob.$((v) => (v ? "Times New Roman" : "monospace"))}
              size={20}
              padding={[10, 10, 10, 10]}
              textAlign="start"
            >
              啦啦啦 TEST sdfsdf asdf asldkfj asd lasdjflaksd jflaksdjf; sdf;
              alsdkfja; lsdkfj alksdjf lskdjfkdjf sdf sdkfj skdjfwlek jwl sodifu
              wlekj lskdf uwoekrjfl kjsdlf iu
            </Text>
          </VStack>

          <VScroll
            dimension={[100, Infinity]}
            weight={1}
            backgroundColor={[255, 244, 100, 1]}
            data={
              new Observable<Array<{ id: string }>>((f) => {
                let arr = Array(30)
                  .fill(0)
                  .map((_, i) => ({
                    id: String(i),
                  }));
                setInterval(() => {
                  arr.push(arr.shift()!);
                  f(arr);
                }, 30);
              })
            }
            renderItem={({ id }) => {
              return (
                <Text
                  backgroundColor={[255, 255, 255, 1]}
                  margin={[5, 5, 5, 5 * Number(id)]}
                  padding={[10, 10, 10, 10]}
                  dimension={[Infinity, 50]}
                  fontFamily="Arial"
                >
                  this is {id}
                </Text>
                // <Image
                //   margin={[10, 10, 10, 10]}
                //   dimension={[200, 100]}
                //   backgroundColor={[255, 255, 255, 1]}
                //   padding={[10, 10, 10, 10]}
                //   objectFit="cover"
                //   url="https://i.ytimg.com/vi/xGr53sCo62c/hqdefault.jpg"
                // />
              );
            }}
          />
        </HStack>
      </VStack>
    </VStack>
  )
);
