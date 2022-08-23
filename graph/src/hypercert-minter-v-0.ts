import {
  AdminChanged,
  ApprovalForAll,
  BeaconUpgraded,
  ImpactClaimed,
  Initialized,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TransferBatch,
  TransferSingle,
  URI,
  Upgraded,
  RightAdded,
  WorkScopeAdded,
  ImpactScopeAdded,
} from "../generated/HypercertMinterV0/HypercertMinterV0";
import { Hypercert, HypercertBalance, ImpactScope, Right, WorkScope } from "../generated/schema";

export function handleAdminChanged(event: AdminChanged): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())
  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())
  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }
  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)
  // // Entity fields can be set based on event parameters
  // entity.previousAdmin = event.params.previousAdmin
  // entity.newAdmin = event.params.newAdmin
  // // Entities can be written to the store with `.save()`
  // entity.save()
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.UPGRADER_ROLE(...)
  // - contract.balanceOf(...)
  // - contract.balanceOfBatch(...)
  // - contract.contributorImpacts(...)
  // - contract.counter(...)
  // - contract.exists(...)
  // - contract.getImpactCert(...)
  // - contract.getRoleAdmin(...)
  // - contract.hasRole(...)
  // - contract.impactScopes(...)
  // - contract.isApprovedForAll(...)
  // - contract.proxiableUUID(...)
  // - contract.rights(...)
  // - contract.supportsInterface(...)
  // - contract.totalSupply(...)
  // - contract.uri(...)
  // - contract.version(...)
  // - contract.workScopes(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBeaconUpgraded(event: BeaconUpgraded): void {}

export function handleImpactClaimed(event: ImpactClaimed): void {
  let entity = new Hypercert(event.params.id.toString());
  entity.claimHash = event.params.claimHash;
  const contributors = [] as string[];
  for (let i=0; i<event.params.contributors.length; i++)
  {
    const address = event.params.contributors[i];
    contributors.push(address.toHexString());
  }
  entity.contributors = contributors;
  entity.impactDateFrom = event.params.impactTimeframe[0];
  entity.impactDateTo = event.params.impactTimeframe[1];
  entity.impactScopes = event.params.impactScopes;
  entity.rights = event.params.rights;
  entity.uri = event.params.uri;
  entity.version = event.params.version;
  entity.workDateFrom = event.params.workTimeframe[0];
  entity.workDateTo = event.params.workTimeframe[1];
  entity.workScopes = event.params.workScopes;
  entity.save();
}

export function handleImpactScopeAdded(event: ImpactScopeAdded): void {
  let entity = new ImpactScope(event.params.id);
  entity.text = event.params.text;
  entity.save();
}

export function handleInitialized(event: Initialized): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleRightAdded(event: RightAdded): void {
  let entity = new Right(event.params.id);
  entity.text = event.params.text;
  entity.save();
}

export function handleWorkScopeAdded(event: WorkScopeAdded): void {
  let entity = new WorkScope(event.params.id);
  entity.text = event.params.text;
  entity.save();
}

export function handleTransferBatch(event: TransferBatch): void {}

export function handleTransferSingle(event: TransferSingle): void {
  let balanceFrom = HypercertBalance.load(event.params.from);
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (balanceFrom) {
    // Entity fields can be set using simple assignments
    balanceFrom.amount = balanceFrom.amount - event.params.value;
    balanceFrom.save();
  }

  let balanceTo = HypercertBalance.load(event.params.to);
  if (!balanceTo) {
    // Entity fields can be set using simple assignments
    balanceTo = new HypercertBalance(event.params.to);
  }

  balanceTo.amount = balanceTo.amount + event.params.value;
  balanceTo.save();
}

export function handleURI(event: URI): void {}

export function handleUpgraded(event: Upgraded): void {}
