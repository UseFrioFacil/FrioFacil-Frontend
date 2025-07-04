import type { FC } from 'react';
import { ShieldCheck, Users, Calendar, BarChart, DollarSign, Zap } from 'lucide-react';
import './MainPageStyle.css';
import "../../styles/global.css"
import FeatureCard from "./uiLanding/FeatureCard"
import PricingCard from "./uiLanding/PricingCard"
import FaqItem from './uiLanding/FaqItem';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';


// Componente Principal da Aplicação
const App: FC = () => {
  return (
    <div className="app">
      <Header showOptions={true} showMenu={true}/>

      {/* Seção Hero */}
      <main>
        <section className="hero">
          <div className="hero-content container">
            <h1 className="hero-title">
              Gerencie sua empresa de climatização <span>sem complicação</span>.
            </h1>
            <p className="hero-subtitle">
              FrioFácil é a plataforma completa para organizar seus clientes, agendamentos e finanças. Mais tempo para você, mais satisfação para seus clientes.
            </p>
            <div className="hero-buttons">
              <a href="#pricing" className="btn btn-primary btn-lg">
                Ver Planos e Preços
              </a>
              <a href="#features" className="btn btn-secondary btn-lg">
                Conhecer Recursos
              </a>
            </div>
            <div>
              <img 
                src="https://placehold.co/1200x600/E0F2FE/0284C7?text=Dashboard+FrioF%C3%A1cil" 
                alt="Dashboard da plataforma FrioFácil" 
                className="hero-image"
              />
            </div>
          </div>
        </section>

        {/* Seção de Recursos */}
        <section id="features" className="section features">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Tudo em um só lugar</span>
              <h2 className="section-title">A plataforma que trabalha por você</h2>
              <p className="section-description">
                Deixe a burocracia de lado e foque no que realmente importa: um serviço de qualidade.
              </p>
            </div>
            <div className="features-grid">
              <FeatureCard icon={Users} title="Gestão de Clientes" color="bg-blue-500">
                Tenha um cadastro completo de seus clientes, com histórico de serviços, equipamentos e contatos. Acesse tudo de qualquer lugar.
              </FeatureCard>
              <FeatureCard icon={Calendar} title="Agenda Inteligente" color="bg-green-500">
                Organize as visitas técnicas da sua equipe com uma agenda fácil de usar. Evite conflitos de horário e otimize suas rotas.
              </FeatureCard>
              <FeatureCard icon={DollarSign} title="Controle Financeiro" color="bg-yellow-500">
                Crie orçamentos e ordens de serviço em segundos. Acompanhe pagamentos e tenha uma visão clara da saúde financeira do seu negócio.
              </FeatureCard>
              <FeatureCard icon={BarChart} title="Relatórios Detalhados" color="bg-purple-500">
                Analise o desempenho da sua empresa com relatórios de faturamento, serviços mais rentáveis e produtividade da equipe.
              </FeatureCard>
              <FeatureCard icon={ShieldCheck} title="Histórico de Manutenção" color="bg-red-500">
                Registre cada manutenção preventiva e corretiva. Gere mais valor para seu cliente com um histórico completo e confiável.
              </FeatureCard>
              <FeatureCard icon={Zap} title="Automação de Lembretes" color="bg-indigo-500">
                Envie lembretes automáticos de manutenções futuras para seus clientes via WhatsApp ou e-mail, garantindo a recorrência do serviço.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Seção de Planos */}
        <section id="pricing" className="section pricing">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Preços Transparentes</span>
              <h2 className="section-title">Escolha o plano perfeito para sua empresa</h2>
              <p className="section-description">
                Comece pequeno e cresça conosco. Sem taxas escondidas ou contratos de longo prazo.
              </p>
            </div>
            <div className="pricing-grid">
              <PricingCard
                plan="Básico"
                price="29,99"
                features={[
                  'Até 100 clientes',
                  'Ordens de serviço ilimitadas',
                  'Suporte via e-mail',
                  'Lembretes manuais',
                  'Dashboard de gerenciamento'
                ]}
                cta="Começar com Básico"
              />
              <PricingCard
                plan="Profissional"
                price="49,99"
                features={[
                  "Clientes ilimitados",
                  "Lembretes automáticos para clientes",
                  "Suporte via WhatsApp",
                  "Dashboard com gráficos e métricas",
                  "Orçamentos online com aprovação",
                  "Assinatura digital nas OSs"
                ]}
                cta="Escolher Profissional"
                popular={true}
              />
            </div>
          </div>
        </section>

        {/* Seção de FAQ */}
        <section id="faq" className="section faq">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Dúvidas Frequentes</h2>
              <p className="section-description">Tudo o que você precisa saber antes de começar.</p>
            </div>
            <div className="faq-content">
              <FaqItem
                question="Preciso instalar algum programa?"
                answer="Não! O FrioFácil é 100% online. Você e sua equipe podem acessar de qualquer lugar, seja pelo computador, tablet ou celular, apenas com um navegador de internet."
              />
              <FaqItem
                question="Meus dados estão seguros na plataforma?"
                answer="Sim. A segurança é nossa prioridade máxima. Usamos criptografia de ponta e servidores seguros para garantir que seus dados e os de seus clientes estejam sempre protegidos."
              />
              <FaqItem
                question="Existe um período de teste gratuito?"
                answer="Oferecemos uma garantia de satisfação. Você pode testar qualquer plano e, se não ficar satisfeito nos primeiros 7 dias, devolvemos seu dinheiro sem burocracia."
              />
              <FaqItem
                question="Como funciona o suporte técnico?"
                answer="Nosso suporte está disponível para ajudar. Dependendo do seu plano, você pode nos contatar por e-mail ou ter um atendimento prioritário via WhatsApp para resolver qualquer questão rapidamente."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default App;