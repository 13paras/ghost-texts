import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { getServerSession, User as NextAuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await connectDb();

  const session = await getServerSession(authOptions);
  const _user: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    // Aggregate messages by month
    const aggregatedData = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      {
        $group: {
          _id: {
            month: { $month: "$messages.createdAt" },
            year: { $year: "$messages.createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Create an array of all months in the last year
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i - 1, 1);
      allMonths.push({
        _id: {
          month: date.toLocaleString('default', { month: 'long' }),
          year: date.getFullYear(),
        },
        count: 0,
      });
    }

    // Merge the aggregated data with the all months array
    const mergedData = allMonths.map(month => {
      const matchingData = aggregatedData.find(
        data => data._id.year === month._id.year && data._id.month === new Date(month._id.month + ' 1, 2000').getMonth() + 1
      );
      return matchingData || month;
    });

    // Format the month names
    mergedData.forEach((data) => {
      data._id.month = new Date(0, data._id.month - 1, 1).toLocaleString(
        "default",
        { month: "long" },
      );
    });

    return Response.json({
      success: true,
      message: "Message stats fetched",
      data: mergedData,
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}