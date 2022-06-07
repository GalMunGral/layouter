import { Display } from "./Display.js";
import { HStack } from "./HStack.js";
import { Text } from "./Text.js";
import { VScroll } from "./VScroll.js";
import { VStack } from "./VStack.js";

function Test<T>(type: new (p: T) => any, props: T, ...children: any[]) {
  return new type({ ...props, children });
}

new Display(
  (
    <VStack backgroundColor={[0, 0, 0, 1]}>
      <VStack
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
        <Text size={20} padding={[10, 10, 10, 10]}>
          啦啦啦 TEST sdfsdf asdf asldkfj asd lasdjflaksd jflaksdjf; alk sdf;
          alsdkfja; lsdkfj alksdjf lskdjfkdjf sdf sdkfj skdjfwlek jwl sodifu
          wlekj lskdf uwoekrjfl kjsdlf iu
        </Text>
      </VStack>
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
            <Text size={20} padding={[10, 10, 10, 10]} textAlign="start">
              啦啦啦 TEST sdfsdf asdf asldkfj asd lasdjflaksd jflaksdjf; alk
              sdf; alsdkfja; lsdkfj alksdjf lskdjfkdjf sdf sdkfj skdjfwlek jwl
              sodifu wlekj lskdf uwoekrjfl kjsdlf iu
            </Text>
          </VStack>
          <Text
            size={20}
            margin={[20, 20, 10, 10]}
            dimension={[200, 100]}
            padding={[10, 10, 10, 10]}
            textAlign="start"
            color={[0, 0, 0, 1]}
          >
            heysssss {name}
          </Text>
          <VScroll
            dimension={[100, Infinity]}
            weight={1}
            backgroundColor={[255, 244, 100, 1]}
            data={Array(30)
              .fill(0)
              .map((_, i) => ({
                id: String(i),
                name: "asdfasfadfaf",
              }))}
            renderItem={({ name }) => {
              return (
                <Text
                  backgroundColor={[0, 255, 0, 1]}
                  margin={[10, 10, 10, 10]}
                  size={20}
                  dimension={[200, 40]}
                  padding={[10, 10, 10, 10]}
                  textAlign="start"
                  color={[0, 0, 0, 1]}
                >
                  heysssss {name}
                </Text>
              );
            }}
          />
        </HStack>
      </VStack>
    </VStack>
  )
);
