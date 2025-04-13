export class RecallAssetsDto {
  ownerAddress: string;     // user requesting the recall (e.g., Alice)
  privateKey: string;    // Alice's private key to sign the recall
}
