import { IconCopy } from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Male from "../../../assets/images/male.png";
import { getSetting } from "../../../store/setting/action";
import { Toast } from "../../../util/Toast";

const PurchaseVipPlan = (props) => {
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state.setting);

  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>No.</th>
          <th>Image</th>
          <th>Name</th>
          <th>Unique ID</th>
          <th>Username</th>
          <th className="text-nowrap">{`Amount (${setting?.currency?.symbol || "$"})`}</th>
          {/* <th>Rupee</th> */}
          <th>Validity</th>
          <th className="text-nowrap">ValidityType</th>
          <th className="text-nowrap">Payment Gateway</th>
          <th className="text-nowrap">Purchase Date</th>
        </tr>
      </thead>
      <tbody>
        {props.data?.length > 0 ? (
          props.data.map((data, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    height="50px"
                    width="50px"
                    alt="app"
                    src={data?.image ? data?.image : Male}
                    style={{
                      boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                      border: "2px solid #fff",
                      borderRadius: 10,
                      objectFit: "cover",
                      display: "block",
                    }}
                    className="mx-auto"
                  />
                </td>
                <td className="text-nowrap">
                  {data.name || "-"}
                  {data.name && (
                    <IconCopy
                      size={16}
                      className="ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => copyToClipboard(data.name)}
                    />
                  )}
                </td>
                <td className="text-nowrap">
                  {data.uniqueId || "-"}
                  {data.uniqueId && (
                    <IconCopy
                      size={16}
                      className="ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => copyToClipboard(data.uniqueId)}
                    />
                  )}
                </td>
                <td className="text-nowrap">
                  {data.username || "-"}
                  {data.username && (
                    <IconCopy
                      size={16}
                      className="ms-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => copyToClipboard(data.username)}
                    />
                  )}
                </td>
                <td className="text-primary">
                  {data.dollar} {setting?.currency?.symbol || "$"}
                </td>
                {/* <td className="text-info">{data.rupee}</td> */}
                <td>{data.validity}</td>
                <td>{data.validityType}</td>
                <td className="text-success">{data.paymentGateway}</td>
                <td className="text-nowrap">{data.purchaseDate}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="10" align="center">
              Nothing to show!!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PurchaseVipPlan;
