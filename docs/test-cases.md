WasteIQ – Test Cases

1. Purpose

This document lists test cases for checking the functionality, usability, and reliability of WasteIQ, a smart waste-management platform initially designed for Baripada, Odisha.

2. Test Cases

Test ID| Feature| Test Scenario| Expected Result
TC-01| Citizen Login| Enter valid citizen credentials| Citizen panel opens successfully
TC-02| Invalid Login| Enter incorrect credentials| Access is denied and an error message appears
TC-03| Worker Login| Log in using municipality-provided credentials| Worker panel opens with the appropriate access
TC-04| Admin Login| Enter valid administrator credentials| Admin panel opens with administrative access
TC-05| Bin Information| Open the Smart Bin section| Available bin details and status are displayed
TC-06| Waste Map| Open the Waste Map page| The map displays Baripada and available bin locations
TC-07| Report Issue| Submit a waste-related complaint| The complaint is submitted and confirmation is displayed
TC-08| Admin Complaint Review| Open submitted complaints in the admin panel| Available complaints can be reviewed
TC-09| Task Assignment| Assign a complaint or task to a worker| The assignment is saved and visible to the relevant worker
TC-10| Disposal Guide| Open the disposal guide| Waste segregation guidance is displayed
TC-11| Recycle & Reward| Open the recycling and rewards section| Available recycling and reward information is displayed
TC-12| Profile| Open the profile section| Relevant account information is displayed
TC-13| Navigation| Move between available sections| Pages open without broken navigation
TC-14| Responsive UI| Open the app on a mobile screen| Content remains readable and usable
TC-15| Access Control| Attempt to access a restricted panel as an unauthorized user| Restricted information and actions remain protected

3. Testing Procedure

1. Open the application.
2. Test each feature using suitable test accounts and sample data.
3. Record whether the actual result matches the expected result.
4. Note any errors, missing information, or unexpected behavior.
5. Fix identified issues and repeat the relevant tests.

4. Test Result Template

For each test, record:

- Test ID
- Actual result
- Status: Pass, Fail, or Not Tested
- Issue found, if any
- Corrective action taken

5. Important Note

The scenarios above are planned test cases, not verified test results. Mark a test as Pass only after checking the feature in the running application. Some tests require configured accounts, database access, or backend functionality.

6. Conclusion

Testing helps identify issues in WasteIQ and improve its reliability, usability, and suitability for citizens, sanitation workers, and administrators.
