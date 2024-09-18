<template>
  <div class="max-w-6xl mx-64 p-6 bg-white rounded-lg shadow-lg mt-4 ">
    <h1 class="text-3xl font-bold text-gray-800 text-left ml-14">Loan terms per policy</h1>
    <div class="flex justify-between mt-10 space-x-4">
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-sm ml-10">
        <h1 class="text-lg font-semibold text-gray-700 mb-2">AGENCY DETAILS</h1>
        <h1 class="text-ms font-bold text-gray-900">LIC Insurance</h1>
        <p class="text-gray-600 mb-2">14 Center St , North Easton MA 02356</p>
        <p class="text-gray-600">support@link-finance.com</p>
        <p class="text-gray-600">+15089691980</p>
      </div>
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-sm mr-10">
        <h1 class="text-lg font-semibold text-gray-700 mb-2">INSURED DETAILS</h1>
        <h1 class="text-ms font-bold text-gray-900">Sumiran Biswas</h1>
        <p class="text-gray-600 mb-2">99 Easton, MA 02356</p>
        <p class="text-gray-600">sumiran.b@cisinlabs.com</p>
        <p class="text-gray-600">+917788123490</p>
      </div>
    </div>

    <!-- table -->

    <div class="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg mt-4">
      <table class="min-w-full table-auto border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th
              class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-600"
            >
              COVERAGE
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-600"
            >
              EFFECTIVE DATE
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-600"
            >
              QUOTE OR POLICY NO.
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-600"
            >
              CARRIER/WHOLESALER
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-600"
            >
              TOTAL PREMIUM
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-600"
            >
              DOWN PAYMENT
            </th>
            <th
              class="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-600"
            >
              AMOUNT FINANCED
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-sm text-gray-700">
            <td class="border border-gray-300 px-4 py-2">Accident</td>
            <td class="border border-gray-300 px-4 py-2">Sep 10th, 2024</td>
            <td class="border border-gray-300 px-4 py-2">000000</td>
            <td class="border border-gray-300 px-4 py-2">
              21st Century<br />Insurance Company<br />5Star CRC
            </td>
            <td class="border border-gray-300 px-4 py-2 text-right">$1,000.00</td>
            <td class="border border-gray-300 px-4 py-2 text-right">$469.40</td>
            <td class="border border-gray-300 px-4 py-2 text-right">$897.60</td>
          </tr>

          <tr class="text-sm text-gray-500">
            <td class="border border-gray-300 px-4 py-2" colspan="3"></td>
            <td class="border border-gray-300 px-4 py-2">
              <div class="space-y-1">
                <span class="block">Policy Fee: $111.00</span>
                <span class="block">Agency Fee: $21.00</span>
                <span class="block">Broker Fee: $12.00</span>
                <span class="block">Taxes: $122.00</span>
                <span class="block">Other Fees: $101.00</span>
              </div>
            </td>
            <td colspan="3" class="border border-gray-300"></td>
          </tr>

          <tr class="text-sm text-gray-500">
            <td colspan="3" class="border border-gray-300 px-4 py-2"></td>
            <td class="border border-gray-300 px-4 py-2">
              <span class="block">Documentary Stamp Tax:</span>
            </td>
            <td class="border border-gray-300 px-4 py-2 text-right">
              <span class="block">$12.94</span>
            </td>
            <td colspan="2" class="border border-gray-300"></td>
          </tr>
          <tr class="text-sm text-gray-500">
            <td colspan="3" class="border border-gray-300 px-4 py-2"></td>
            <td class="border border-gray-300 px-4 py-2">
              <span class="block">Service Fees:</span>
            </td>
            <td class="border border-gray-300 px-4 py-2 text-right">
              <span class="block">$16.90</span>
            </td>
            <td colspan="2" class="border border-gray-300"></td>
          </tr>
          <tr class="text-sm text-gray-500">
            <td colspan="3" class="border border-gray-300 px-4 py-2"></td>
            <td class="border border-gray-300 px-4 py-2">
              <span class="block">Interest:</span>
            </td>
            <td class="border border-gray-300 px-4 py-2 text-right">
              <span class="block">$70.60</span>
            </td>
            <td colspan="2" class="border border-gray-300"></td>
          </tr>
          <tr class="text-sm text-gray-500">
            <td colspan="3" class="border border-gray-300 px-4 py-2"></td>
            <td class="border border-gray-300 px-4 py-2">
              <span class="block font-semibold">Totals:</span>
            </td>
            <td class="border border-gray-300 px-4 py-2 text-right">
              <span class="block font-semibold">$1,454.50</span>
            </td>
            <td colspan="1" class="border border-gray-300 text-right px-4 py-2 font-semibold">$469.40</td>
            <td colspan="1" class="border border-gray-300 text-right px-4 py-2 font-semibold">$897.60</td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
