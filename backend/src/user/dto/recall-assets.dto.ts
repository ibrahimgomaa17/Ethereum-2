export class RecallAssetsDto {
  fromAddress: string;   // current holder of the assets (e.g., Bob)
  toAddress: string;     // user requesting the recall (e.g., Alice)
  privateKey: string;    // Alice's private key to sign the recall
}
