import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllDeliveryQuery } from "../../../api/metroApi";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useEffect } from "react";
import useDisclosure from "../../../hook/useDisclosure";
import {
  setSearch,
  setSearchBy,
} from "../../../redux-toolkit/counter/featuresCounter";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import TableError from "../../../components/error/TableError";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import TableWrapper from "../../../components/table/TableWrapper";
import SearchField from "../../../components/table/SearchField";
import {
  columns,
  dropData,
} from "../../../utility/table-columns/TripDeliveryColumns";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ExportModal from "../../../components/features/ExportModal";
import TableUI from "../../../components/table/TableUI";
import TableDelivery from "../../../components/masterlist/depot/TableDelivery";
import { getPathLength } from "geolib";
import useExcel from "../../../hook/useExcel";
import DeliveryDrawer from "../../../components/masterlist/depot/DeliveryDrawer";

const TripDepotDelivery = () => {
  // STATE
  const [date, setDate] = useState();
  const [obj, setObj] = useState([]);

  const { page, limit, search, searchBy } = useSelector(
    (state) => state.features.table
  );

  // RTK QUERY

  const { data, isLoading, isError, isFetching } = useGetAllDeliveryQuery(
    { page, limit, search, searchBy },
    { refetchOnMountOrArgChange: true }
  );

  const { excelExport } = useExcel();

  // REACT HOOK FORM
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      search_by: {
        id: "_id",
        label: "Id",
      },
      date: dayjs(),
    },
    resolver: null,
    mode: "onChange",
  });

  //   COMPUTE ALL DURATION
  useEffect(() => {
    let users = {};

    data?.data.forEach((trip, i) => {
      const newLocations = trip?.locations.filter(
        (location) => location.status == "left" || location.status == "arrived"
      );

      let user = trip.user_id.id;

      if (!users[user]) {
        users[user] = {
          totalDuration: 0,
          user_id: user,
          department: trip?.user_id?.department,
          name: trip?.user_id?.first_name,
          employee_id: trip?.user_id?.employee_id,
        };
      }

      const startDate = dayjs(newLocations[0]?.date);
      const endDate = dayjs(newLocations[newLocations.length - 1]?.date);
      const duration = endDate.diff(startDate);
      users[user].totalDuration += duration;
    });

    setObj(Object.values(users));

    return () => {
      null;
    };
  }, [data?.data]);

  //   HOOKS
  const dispatch = useDispatch();
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onToggle: onToggleExport,
  } = useDisclosure();

  const handleSearch = (data) => {
    setDate(dayjs(data?.date).format("YYYY-MM-DD"));
    dispatch(setSearch(data.search));
    dispatch(setSearchBy(data.search_by?.id || null));
  };

  const handleToggleExport = async () => {
    onToggleExport();

    let newReports = [];
    let cratesReport = [];

    const newObj = await data?.data?.map((item) => {
      // const newLocations = item?.locations?.filter(
      //   (location) => location.status == "left" || location.status == "arrived"
      // );

      // CRATES REPORT
      // const transaction = item.crates_transaction;
      // console.log("transaction: ", transaction);

      // transaction?.map((crates, i) => {
      //   console.log("crates : ", crates);
      //   const destination = crates.destination;

      //   if (!cratesReport[destination] && destination !== "OTHER LOCATION") {
      //     cratesReport[destination] = {
      //       ...crates,
      //       crates_dropped: parseInt(crates.crates_dropped),
      //       crates_collected: parseInt(crates.crates_collected),
      //       crates_borrowed: parseInt(crates.crates_borrowed),
      //     };
      //   }
      //   if (!cratesReport[destination] && destination === "OTHER LOCATION") {
      //     cratesReport[crates.destination_name] = {
      //       ...crates,
      //       crates_dropped: parseInt(crates.crates_dropped),
      //       crates_collected: parseInt(crates.crates_collected),
      //       crates_borrowed: parseInt(crates.crates_borrowed),
      //     };
      //   }

      //   if (destination !== "OTHER LOCATION") {
      //     cratesReport[destination]?.crates_dropped + crates?.crates_dropped;
      //     cratesReport[destination]?.crates_collected +
      //       crates?.crates_collected;
      //     cratesReport[destination]?.crates_borrowed + crates?.crates_borrowed;
      //   } else {
      //     cratesReport[crates.destination_name]?.crates_dropped +
      //       crates?.crates_dropped;
      //     cratesReport[crates.destination_name]?.crates_collected +
      //       crates?.crates_collected;
      //     cratesReport[crates.destination_name]?.crates_borrowed +
      //       crates?.crates_borrowed;
      //   }
      //   // const destination = item?.crates_transaction?.destination;

      //   // if (!cratesReport[destination] && destination !== "OTHER LOCATION") {
      //   //   cratesReport[destination] = {
      //   //     ...crates,
      //   //     crates_dropped: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped || "0"
      //   //     ),
      //   //     crates_collected: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
      //   //         "0"
      //   //     ),
      //   //     crates_borrowed: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
      //   //         "0"
      //   //     ),
      //   //   };
      //   // }
      //   // if (!cratesReport[destination] && destination === "OTHER LOCATION") {
      //   //   cratesReport[crates.destination_name] = {
      //   //     ...crates,
      //   //     crates_dropped: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped || "0"
      //   //     ),
      //   //     crates_collected: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
      //   //         "0"
      //   //     ),
      //   //     crates_borrowed: parseInt(
      //   //       item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
      //   //         "0"
      //   //     ),
      //   //   };
      //   // }

      //   // if (destination !== "OTHER LOCATION") {
      //   //   cratesReport[destination]?.crates_dropped +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped || "0";
      //   //   cratesReport[destination]?.crates_collected +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
      //   //     "0";
      //   //   cratesReport[destination]?.crates_borrowed +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed || "0";
      //   // } else {
      //   //   cratesReport[crates.destination_name]?.crates_dropped +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped || "0";
      //   //   cratesReport[crates.destination_name]?.crates_collected +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
      //   //     "0";
      //   //   cratesReport[crates.destination_name]?.crates_borrowed +
      //   //     item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed || "0";
      //   // }
      // });
      // CRATES REPORT

      const newLocations = item.locations
        .filter(
          (location) =>
            location.status == "left" || location.status == "arrived"
        )
        .sort((a, b) => {
          return new Date(a?.date) - new Date(b?.date);
        });

      const destination = newLocations?.map((loc, i) => {
        if (loc.status == "left") {
          return `Left → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else if (loc.status == "arrived") {
          return `Arrived → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        } else {
          return `Interval → ${loc?.address[0]?.name || "(No Name)"}  ${
            loc?.address[0]?.district || "(No District)"
          } ${loc?.address[0]?.city || "(No City)"}  ${
            loc?.address[0]?.subregion || "(No Subregion)"
          } | `;
        }
      });

      let counter = 1;
      const perStatus = newLocations?.map((loc, i) => {
        const title = `${loc.status.toUpperCase().at(0)}${loc.status.slice(
          1
        )} ${i % 2 === 0 ? counter : [Math.floor(i / 2) + 1]}`;
        i % 2 !== 0 && counter++;
        if (i == 0 || newLocations.length - 1 === i) {
          return {
            [title]: "Depot",
          };
        }
        if (loc?.status === "left" && i !== 0) {
          return {
            [title]:
              item?.locations[i - 1]?.destination ||
              `${loc?.address[0]?.name || "(No Name)"}  ${
                loc?.address[0]?.district || "(No District)"
              } ${loc?.address[0]?.city || "(No City)"}  ${
                loc?.address[0]?.subregion || "(No Subregion)"
              }`,
          };
        }
        if (loc?.status === "arrived" && newLocations.length - 1 !== i) {
          return {
            [title]:
              loc?.destination ||
              `${loc?.address[0]?.name || "(No Name)"}  ${
                loc?.address[0]?.district || "(No District)"
              } ${loc?.address[0]?.city || "(No City)"}  ${
                loc?.address[0]?.subregion || "(No Subregion)"
              }`,
            [`Crates ${counter - 1}`]: `Crates Dropped: ${
              item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped || ""
            } | Crates Collected: ${
              item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
              ""
            } | Crates Borrowed: ${
              item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed || ""
            } `,
          };
        }

        return {
          [title]:
            loc?.destination ||
            `${loc?.address[0]?.name || "(No Name)"}  ${
              loc?.address[0]?.district || "(No District)"
            } ${loc?.address[0]?.city || "(No City)"}  ${
              loc?.address[0]?.subregion || "(No Subregion)"
            }`,
        };
      });

      const cratesTransaction = item?.crates_transaction?.map((crates) => {
        return `Crates Dropped: ${crates.crates_dropped} | Crates Collected: ${crates.crates_collected} | Crates Borrowed: ${crates.crates_borrowed} `;
      });

      const gas = item?.diesels?.map((diesel, i) => {
        return `Gas Station: ${diesel?.gas_station_name} Odometer: ${diesel?.odometer} Liter: ${diesel?.liter} Amount: ${diesel?.amount}`;
      });

      const companion = item?.companion?.map((com, i) => {
        return `${Object.values(com)[0]}`;
      });

      const startDate = dayjs(newLocations.at(0)?.date);
      const endDate = dayjs(newLocations.at(-1)?.date);
      const duration = endDate.diff(startDate);
      const totalMinutes = Math.floor(duration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      const totalKm = item?.odometer_done - item?.odometer;
      const estimatedTotalKm = getPathLength(item.points) / 1000;

      newLocations?.map((location, i) => {
        if (i % 2 == 0) {
          const destination = newLocations[i]?.destination;

          if (!cratesReport[destination]) {
            cratesReport[destination] = {
              destination,
              crates_dropped: parseInt(
                item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
                  "0"
              ),
              crates_collected: parseInt(
                item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
                  "0"
              ),
              crates_borrowed: parseInt(
                item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
                  "0"
              ),
            };
          } else {
            cratesReport[destination]?.crates_dropped +
              item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
              "0";
            cratesReport[destination]?.crates_collected +
              item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
              "0";
            cratesReport[destination]?.crates_borrowed +
              item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
              "0";
          }
          // if (!cratesReport[destination] && destination === "OTHER LOCATION") {
          //   cratesReport[crates.destination_name] = {
          //     destination,
          //     crates_dropped: parseInt(
          //       item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
          //         "0"
          //     ),
          //     crates_collected: parseInt(
          //       item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
          //         "0"
          //     ),
          //     crates_borrowed: parseInt(
          //       item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
          //         "0"
          //     ),
          //   };
          // }

          // if (destination !== "OTHER LOCATION") {
          //   cratesReport[destination]?.crates_dropped +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
          //     "0";
          //   cratesReport[destination]?.crates_collected +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
          //     "0";
          //   cratesReport[destination]?.crates_borrowed +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
          //     "0";
          // } else {
          //   cratesReport[crates.destination_name]?.crates_dropped +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
          //     "0";
          //   cratesReport[crates.destination_name]?.crates_collected +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
          //     "0";
          //   cratesReport[crates.destination_name]?.crates_borrowed +
          //     item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
          //     "0";
          // }

          newReports.push({
            "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
            "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY  h:mm a"),
            Id: item._id.slice(20),
            User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
            Department: item?.user_id.department,
            Vehicle: item?.vehicle_id?.plate_no,
            Duration: `${
              hours > 0 && hours != 1
                ? hours + " hours"
                : hours == 1
                ? hours + " hour"
                : ""
            } ${minutes > 0 ? minutes + " minutes" : ""}${
              hours <= 0 && minutes <= 0 ? "0" : ""
            }`,
            Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
            End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
            "Estimated Total KM": Math.round(estimatedTotalKm),
            "Total KM": Math.round(totalKm),
            Odmeter: item?.odometer,
            "Odmeter Done": item?.odometer_done,
            Companion: companion.join("\n"),
            Others: item?.others !== "null" ? item?.others : "",
            Charging: item?.charging,
            Diesels: gas.join("\n"),
            "Crates Dropped":
              item?.crates_transaction[Math.floor(i / 2)]?.crates_dropped ||
              "0",
            "Crates Collected":
              item?.crates_transaction[Math.floor(i / 2)]?.crates_collected ||
              "0",
            "Crates Borrowed":
              item?.crates_transaction[Math.floor(i / 2)]?.crates_borrowed ||
              "0",
            ////// 2
            // Origin:
            //   i === 0
            //     ? "Depot"
            //     : newLocations[i - 1]?.destination ||
            //       `${location?.address[0]?.name || "(No Name)"}  ${
            //         location?.address[0]?.district || "(No District)"
            //       } ${location?.address[0]?.city || "(No City)"}  ${
            //         location?.address[0]?.subregion || "(No Subregion)"
            //       }`,
            // Destination:
            //   newLocations.length - 1 === i + 1
            //     ? "Depot"
            //     : newLocations[i + 1]?.destination ||
            //       `${newLocations[i + 1].address[0]?.name || "(No Name)"}  ${
            //         newLocations[i + 1].address[0]?.district || "(No District)"
            //       } ${newLocations[i + 1].address[0]?.city || "(No City)"}  ${
            //         newLocations[i + 1].address[0]?.subregion ||
            //         "(No Subregion)"
            //       }`,
            Origin:
              newLocations[i]?.destination ||
              `${location?.address[0]?.name || "(No Name)"}  ${
                location?.address[0]?.district || "(No District)"
              } ${location?.address[0]?.city || "(No City)"}  ${
                location?.address[0]?.subregion || "(No Subregion)"
              }`,
            Destination:
              newLocations[i + 1]?.destination ||
              `${newLocations[i + 1].address[0]?.name || "(No Name)"}  ${
                newLocations[i + 1].address[0]?.district || "(No District)"
              } ${newLocations[i + 1].address[0]?.city || "(No City)"}  ${
                newLocations[i + 1].address[0]?.subregion || "(No Subregion)"
              }`,
            ///// 1
            // Origin:
            //   i === 0
            //     ? "Depot"
            //     : location?.destination ||
            //       `${location?.address[0]?.name || "(No Name)"}  ${
            //         location?.address[0]?.district || "(No District)"
            //       } ${location?.address[0]?.city || "(No City)"}  ${
            //         location?.address[0]?.subregion || "(No Subregion)"
            //       }`,
            // Destination:
            //   newLocations.length - 1 === i + 1
            //     ? "Depot"
            //     : newLocations[i + 1]?.destination ||
            //       `${newLocations[i + 1].address[0]?.name || "(No Name)"}  ${
            //         newLocations[i + 1].address[0]?.district || "(No District)"
            //       } ${newLocations[i + 1].address[0]?.city || "(No City)"}  ${
            //         newLocations[i + 1].address[0]?.subregion ||
            //         "(No Subregion)"
            //       }`,
          });
        }
      });

      // return {
      //   "Trip Date": dayjs(item?.trip_date).format("MMM-DD-YYYY h:mm a"),
      //   "Sync Date": dayjs(item?.createdAt).format("MMM-DD-YYYY h:mm a"),
      //   Id: item._id.slice(20),
      //   User: `${item?.user_id?.first_name} ${item?.user_id?.last_name}`,
      //   Department: item?.user_id.department,
      //   Vehicle: item?.vehicle_id?.plate_no,
      //   Duration: `${
      //     hours > 0 && hours != 1
      //       ? hours + " hours"
      //       : hours == 1
      //       ? hours + " hour"
      //       : ""
      //   } ${minutes > 0 ? minutes + " minutes" : ""}${
      //     hours <= 0 && minutes <= 0 ? "0" : ""
      //   }`,
      //   Start: dayjs(startDate).format("MMM-DD-YY hh:mm a"),
      //   End: dayjs(endDate).format("MMM-DD-YY hh:mm a"),
      //   // Locations: destination.join("\n"),
      //   // Crates: cratesTransaction.join("\n"),
      //   Diesels: gas.join("\n"),
      //   "Estimated Total KM": Math.round(estimatedTotalKm),
      //   "Total KM": Math.round(totalKm),
      //   Destination: item?.destination,
      //   Odometer: item?.odometer,
      //   "Odometer Done": item?.odometer_done,
      //   Companion: companion.join("\n"),
      //   Others: item?.others !== "null" ? item?.others : "",
      //   Charging: item?.charging,
      //   ...Object.assign({}, ...perStatus),
      // };
    });

    const dailyDuration = obj?.map((item) => {
      const totalMinutes = Math.floor(item.totalDuration / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return {
        "Employee Id": item.employee_id,
        Name: item.name,
        Department: item?.department,
        "Total Duration": `${
          hours > 0 && hours != 1
            ? hours + " hours"
            : hours == 1
            ? hours + " hour"
            : ""
        } ${minutes > 0 ? minutes + " minutes" : ""}${
          hours <= 0 && minutes <= 0 ? "0" : ""
        }`,
      };
    });
    // console.log(Object.values(cratesReport));
    const cratesReportCSV = Object.values(cratesReport)?.map((item) => {
      return {
        Destination: item.destination,
        // "OTHER LOCATION": item.destination_name,
        "Crates Dropped": item.crates_dropped,
        "Crates Collected": item.crates_collected,
        "Crates Borrowed": item.crates_borrowed,
      };
    });
    // console.log(cratesReportCSV);

    await excelExport(newReports, "METRO-DELIVERY-REPORT");
    await excelExport(dailyDuration, "METRO-DELIVERY-USER-DURATION-REPORT");
    await excelExport(cratesReportCSV, "METRO-DELIVERY-CRATES-REPORT");

    onCloseExport();
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return <TableError />;
  }

  return (
    <Box>
      <TableWrapper sx={{ margin: "0 auto" }}>
        <Stack direction="row" className="table__header">
          <SearchField
            onSubmit={handleSubmit(handleSearch)}
            control={control}
            errors={errors}
            register={register}
            options={dropData}
            watch={watch}
            isFetching={null}
          />

          <Box>
            <Tooltip title="Refresh">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={() => {
                  dispatch(setSearch(""));
                  dispatch(setSearchBy("_id"));
                  reset();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export">
              <IconButton
                sx={{ marginRight: "15px" }}
                onClick={handleToggleExport}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        {/* TABLE */}
        <TableUI
          isFetching={isFetching}
          data={data}
          columns={columns}
          rows={data?.data?.map((item, i) => {
            return <TableDelivery key={i} item={item} columns={columns} />;
          })}
        />

        {/* EXPORT LOADING */}
        <ExportModal isOpenExport={isOpenExport} />

        {/* DRAWER */}
        <DeliveryDrawer />
      </TableWrapper>
    </Box>
  );
};

export default TripDepotDelivery;
