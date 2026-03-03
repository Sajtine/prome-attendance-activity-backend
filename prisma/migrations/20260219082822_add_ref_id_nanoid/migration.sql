-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "ref_id" VARCHAR(10) NOT NULL,
    "fullname" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_ref_id_key" ON "Attendance"("ref_id");
