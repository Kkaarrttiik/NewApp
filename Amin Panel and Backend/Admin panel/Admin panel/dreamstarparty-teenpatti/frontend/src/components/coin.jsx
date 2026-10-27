import "../style/coin.css";

function convertToShortForm(number) {
  if (number >= 1000) {
    const suffixes = ["", "k", "M", "B", "T"];
    const magnitude = Math.floor(Math.log10(number) / 3);
    const shortNumber = (number / Math.pow(1000, magnitude)).toFixed(0);
    return shortNumber + suffixes[magnitude];
  }
  return number?.toString();
}
function Coin({ src, left, top, name }) {
  const shortForm = convertToShortForm(name);
  let topCoin = parseFloat(top) + 9;
  let leftCoin = parseFloat(left) + 8;
  return (
    <div
      className="coin"
      style={{
        backgroundImage: `url('${src}')`,
        left: left,
        top: top,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span className="cardShowCoin_" style={{ color: "white" }}>
        {shortForm}
      </span>
    </div>
  );
}

export default Coin;
