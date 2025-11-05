import { setupAPIClient } from "./api";

/**
 * Verifica o status detalhado da assinatura de um usuário
 *
 * @returns Informações detalhadas sobre a assinatura do usuário
 */
export async function verifySubscriptionStatus() {
  try {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/verify-subscription-details");
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar status da assinatura:", error);
    throw error;
  }
}

/**
 * Repara problemas na assinatura de um usuário
 *
 * @returns Resultado da operação de reparo
 */
export async function repairSubscription() {
  try {
    const apiClient = setupAPIClient();
    const response = await apiClient.post("/repair-subscription");
    return response.data;
  } catch (error) {
    console.error("Erro ao reparar assinatura:", error);
    throw error;
  }
}

/**
 * Verifica se o usuário tem acesso ao portal do cliente Stripe
 *
 * @returns Um objeto indicando se o acesso é possível e informações adicionais
 */
export async function checkPortalAccess() {
  try {
    // Verificar detalhes da assinatura
    const details = await verifySubscriptionStatus();

    // Verificar se todas as condições para o acesso ao portal são atendidas
    const hasCustomerId = !!details.user.stripe_customer_id;
    const customerExists = details.stripe_status?.customerExists !== false;
    const hasSubscription = !!details.subscription;
    const subscriptionActive = details.subscription?.status === "active";
    const subscriptionExistsInStripe =
      !!details.stripe_status?.subscriptionData;

    const canAccessPortal =
      hasCustomerId &&
      customerExists &&
      hasSubscription &&
      subscriptionActive &&
      subscriptionExistsInStripe;

    return {
      canAccess: canAccessPortal,
      needsRepair:
        hasCustomerId &&
        (!customerExists || (hasSubscription && !subscriptionExistsInStripe)),
      missingSubscription: hasCustomerId && customerExists && !hasSubscription,
      inactiveSubscription:
        hasCustomerId &&
        customerExists &&
        hasSubscription &&
        !subscriptionActive,
      details,
    };
  } catch (error) {
    console.error("Erro ao verificar acesso ao portal:", error);
    return {
      canAccess: false,
      error,
    };
  }
}
