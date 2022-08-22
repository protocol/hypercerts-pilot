import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Hypercert } from "../generated/schema";
import { handleImpactClaimed } from "../src/hypercert-minter-v-0";
import { createImpactClaimedEvent } from "./hypercert-minter-v-0-utils";

const DEFAULT_ENTITY_ADDRESS = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"; // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
const HYPERCERT = "Hypercert";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe(HYPERCERT, () => {
  const id = 1;
  const claimHash = "0x307861626c6b736a6466736466736466";
  const contributor0 = "0x0716405125cfcad8aaa4f816d2468a8898da374b";
  const workTimeframe0 = 1669849200;
  const workTimeframe1 = 1672441200;
  const impactTimeframe0 = 1672527600;
  const impactTimeframe1 = 1703977200;
  const impactScope0 = "0x74686520717569636b2062726f776e2e";
  const impactScope1 = "0x2a666f7820616e6420686f756e64732a";
  const workScope0 = "0x6a75737420676f7474612064616e6365";
  const right0 = "0x22726967687420746f20666967687422";
  const right1 = "0x22726967687420746f20706172747922";
  const uri = "http://tempuri.org/foo/bar";
  const version = 1;

  beforeAll(() => {
    const e = createImpactClaimedEvent(
      BigInt.fromI32(id),
      Bytes.fromHexString(claimHash),
      [Address.fromString(contributor0)],
      [BigInt.fromI32(workTimeframe0), BigInt.fromI32(workTimeframe1)],
      [BigInt.fromI32(impactTimeframe0), BigInt.fromI32(impactTimeframe1)],
      [Bytes.fromHexString(workScope0)],
      [Bytes.fromHexString(impactScope0), Bytes.fromHexString(impactScope1)],
      [Bytes.fromHexString(right0), Bytes.fromHexString(right1)],
      BigInt.fromI32(version),
      uri
    );
    handleImpactClaimed(e);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("entity created and stored", () => {
    assert.entityCount(HYPERCERT, 1);
    const idStr = id.toString();
    assert.fieldEquals(HYPERCERT, idStr, "claimHash", claimHash);
    assert.fieldEquals(HYPERCERT, idStr, "uri", uri);
    assert.fieldEquals(HYPERCERT, idStr, "version", version.toString());
    const entity = Hypercert.load(idStr);
    assert.assertNotNull(entity);
    if (entity) {
      assert.assertTrue(entity.contributors.length === 1);
      assert.stringEquals(contributor0, entity.contributors[0]);
      assert.bigIntEquals(BigInt.fromI32(workTimeframe0), entity.workDateFrom);
      assert.bigIntEquals(BigInt.fromI32(workTimeframe1), entity.workDateTo);
      assert.bigIntEquals(
        BigInt.fromI32(impactTimeframe0),
        entity.impactDateFrom
      );
      assert.bigIntEquals(
        BigInt.fromI32(impactTimeframe1),
        entity.impactDateTo
      );
      assert.assertTrue(entity.workScopes.length === 1);
      assert.bytesEquals(Bytes.fromHexString(workScope0), entity.workScopes[0]);
      assert.assertTrue(entity.impactScopes.length === 2);
      assert.bytesEquals(
        Bytes.fromHexString(impactScope0),
        entity.impactScopes[0]
      );
      assert.bytesEquals(
        Bytes.fromHexString(impactScope1),
        entity.impactScopes[1]
      );
      assert.assertTrue(entity.rights.length === 2);
      assert.bytesEquals(Bytes.fromHexString(right0), entity.rights[0]);
      assert.bytesEquals(Bytes.fromHexString(right1), entity.rights[1]);
    }

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
