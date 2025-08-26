  "use client";
  import React from "react";
  import { Form, Button, Modal } from "react-bootstrap";
  import {
    FaSearch,
    FaPlus,
    FaFilter,
    FaTrash
  } from "react-icons/fa";
  import CustomPagination from "./CustomPagination";

  export default function TopActionBar({
    title,
    searchTerm,
    setSearchTerm,
    showUserTypeFilter,
    onAddClick,
    onDeleteClick,
    onFilterClick,
    selectedItems,
    showBulkDeleteModal,
    setShowBulkDeleteModal,
    confirmBulkDelete,
    paginationData,
    setPaginationData,
    setUserType,
    userType,
    getSubscriptionDetails,
    page,
    userFilterList = [],
    selectedUser,
    setSelectedUser,
    onUserFilterChange,
    onPreviousTestsClick,
    onAssignAlertClick,

  }) {

    return (
      <div className="sticky-bar-wrapper">
        <h4 className="textcolors ps-3 pt-3 fw-bold heading-all">{title}</h4>

        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between align-items-center gap-2 px-3 pt-2">

          {/* Search Bar */}
          <div style={{ position: "relative", maxWidth: "220px", width: "100%" }} className="me-md-2">
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              className="search-btn custom-page-input pe-5 tablet-ml-neg"
              suppressHydrationWarning={true}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                color: "#3cd376",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* User Type Filter */}
          {showUserTypeFilter && (
            <Form.Select
              value={userType}
              onChange={(e) => {
                const selectedUserType = e.target.value;
                setUserType(selectedUserType);
                getSubscriptionDetails({ userType: selectedUserType, page: 1, searchTerm });
              }}
              className="me-md-2"
              style={{ maxWidth: "200px", color: "#3cd376" }}
            >
              <option value="">Select User Type</option>
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="patient">Patient</option>
            </Form.Select>
          )}

          {/* User Filter */}
          {userFilterList.length > 0 && (
            <Form.Select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                if (onUserFilterChange) onUserFilterChange(e.target.value);
              }}
              className="me-md-2"
              style={{ maxWidth: "200px", color: "#030303af" }}
            >
              <option value="">Select User...</option>
              {userFilterList.map((user, index) => (
                <option key={index} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          )}

          {/* Buttons + Pagination */}
          <div className="d-flex gap-2 align-items-center flex-wrap flex-md-nowrap">
            {onAddClick && (
              <Button
                className="add-button btn-name custom-bg-button"
                onClick={onAddClick}
              >
                <FaPlus className="me-2" /> Add
              </Button>
            )}


            {onFilterClick && (
              <Button
                className="add-button btn-name custom-bg-button"
                onClick={onFilterClick}
              >
                <FaFilter className="me-2" /> Filter
              </Button>
            )}

            {onDeleteClick && (
              <Button
                className="add-button btn-name custom-bg-button"
                onClick={onDeleteClick}
                disabled={selectedItems?.length === 0}
              >
                <FaTrash className="me-2" /> Delete
              </Button>
            )}
            {onPreviousTestsClick && (
              <Button
                className="add-button btn-name custom-bg-button"
                onClick={onPreviousTestsClick}
              >
                <FaSearch className="me-2" /> Previous Tests
              </Button>
            )}
  {onAssignAlertClick && (
              <Button
                className="add-button btn-name custom-bg-button"
                onClick={onAssignAlertClick}
              >
                <FaSearch className="me-2" /> Assign Alert
              </Button>
            )}


            <CustomPagination
              paginationData={paginationData}
              setPaginationData={setPaginationData}
              className="pagination custom-bg-button"
            />
          </div>
        </div>

        {/* Bulk Delete Modal */}
        <Modal
          show={showBulkDeleteModal}
          onHide={() => setShowBulkDeleteModal(false)}
          size="md"
          centered
        >
          <Modal.Header closeButton className="modal-heading-green">
            <Modal.Title className="text-light fw-bold">Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p className="text-success fw-semibold">
              Are you sure you want to delete the selected items?
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={confirmBulkDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
