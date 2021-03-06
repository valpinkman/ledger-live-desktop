// @flow
import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import type { BigNumber } from "bignumber.js";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TachometerHigh from "~/renderer/icons/TachometerHigh";
import TachometerLow from "~/renderer/icons/TachometerLow";
import TachometerMedium from "~/renderer/icons/TachometerMedium";

import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";

import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import type { Account, FeeStrategy } from "@ledgerhq/live-common/lib/types";

type OnClickType = {
  amount: BigNumber,
  feesStrategy: string,
};

type Props = {
  onClick: OnClickType => void,
  transaction: *,
  account: Account,
  parentAccount: ?Account,
  strategies: FeeStrategy[],
  suffixPerByte?: boolean,
};

const FeesWrapper = styled(Box)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: ${p =>
    `1px solid ${
      p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider
    }`};
  padding: 12px;
  width: 100%;
  font-family: "Inter";
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }
`;

const FeesHeader = styled(Box)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade30};
`;

const FeesValue = styled(Box)`
  text-align: right;
  flex-direction: column;
  justify-content: flex-end;
`;

const SelectFeeStrategy = ({
  transaction,
  account,
  parentAccount,
  onClick,
  strategies,
  suffixPerByte,
}: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const accountUnit = getAccountUnit(mainAccount);
  const feesCurrency = getAccountCurrency(mainAccount);
  const { t } = useTranslation();

  return (
    <Box alignItems="center" flow={2}>
      {strategies.map(s => {
        const selected = transaction.feesStrategy === s.label;
        const amount = s.displayedAmount || s.amount;
        const label = s.label;
        return (
          <FeesWrapper
            key={s.label}
            selected={selected}
            onClick={() => {
              onClick({ amount: s.amount, feesStrategy: label });
            }}
          >
            <FeesHeader horizontal alignItems="center" selected={selected}>
              {label === "medium" ? (
                <TachometerMedium size={14} />
              ) : label === "slow" ? (
                <TachometerLow size={14} />
              ) : (
                <TachometerHigh size={14} />
              )}
              <Text
                style={{ marginLeft: "5px", textTransform: "uppercase" }}
                fontSize={2}
                fontWeight="600"
              >
                <Trans i18nKey={`fees.${label}`} />
              </Text>
            </FeesHeader>
            <FeesValue>
              <FormattedVal
                color="palette.text.shade100"
                fontSize={3}
                fontWeight="600"
                val={amount}
                unit={s.unit ?? accountUnit}
                showCode={!suffixPerByte}
                suffix={
                  suffixPerByte
                    ? ` ${t("send.steps.details.unitPerByte", {
                        unit: s.unit ? s.unit.code : accountUnit.code,
                      })}`
                    : ""
                }
                alwaysShowValue
              />
              {s.displayedAmount ? (
                <CounterValue
                  currency={feesCurrency}
                  value={amount}
                  color="palette.text.shade50"
                  fontWeight="500"
                  fontSize={3}
                  showCode
                  alwaysShowValue
                />
              ) : null}
            </FeesValue>
          </FeesWrapper>
        );
      })}
    </Box>
  );
};

export default SelectFeeStrategy;
