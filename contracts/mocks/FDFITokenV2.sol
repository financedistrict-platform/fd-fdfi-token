// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {SEXYToken} from "../SEXYToken.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @notice Mock upgrade adding a view function to verify state preservation.
contract SEXYTokenV2 is SEXYToken {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function version() external pure returns (string memory) {
        return "2";
    }
}
